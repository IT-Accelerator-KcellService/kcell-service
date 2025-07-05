import RequestService from "../services/requestService.js";
import {Parser} from 'json2csv';

function sanitizeCellValue(val) {
    if (val === null || val === undefined || typeof val === 'symbol') return '';
    if (typeof val === 'number') return Number.isFinite(val) ? val : '';
    if (val instanceof Date) return val.toLocaleDateString('en-CA');
    if (typeof val === 'object') return JSON.stringify(val);
    if (typeof val === 'bigint') return val.toString();
    if (typeof val === 'boolean') return val ? 'true' : 'false';
    return String(val);
}

class AnalyticService {
    static async findByFilters(filters) {
        const requests = await RequestService.findByFilters(filters);

        const total = requests.length;
        const byStatus = this.groupBy(requests, 'status');
        const byType = this.groupBy(requests, 'request_type');
        const byOffice = this.groupBy(requests, 'office_id');
        const byDate = this.groupByDate(requests);

        const averageSLA = this.calcAverageSLA(requests);
        const averageRating = this.calcAverageRating(requests);

        return {
            total,
            byStatus,
            byType,
            byOffice,
            averageSLA,
            averageRating,
            byDate
        };
    }

    static async groupBy(arr, key) {
        return arr.reduce((acc, cur) => {
            acc[cur[key]] = (acc[cur[key]] || 0) + 1;
            return acc;
        }, {});
    }

    static async calcAverageSLA(arr) {
        const durations = arr
            .filter(r => r.actual_completion_date)
            .map(r => new Date(r.actual_completion_date) - new Date(r.date_submitted));
        if (durations.length === 0) return 0;
        const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
        return Math.round(avg / 1000 / 60);
    }

    static async calcAverageRating(arr) {
        const ratings = arr.map(r => r.rating).filter(r => r != null);
        if (ratings.length === 0) return 0;
        return Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length);
    }

    static groupByDate(requests) {
        const grouped = {};

        for (const request of requests) {
            const date = new Date(request.created_date).toISOString().split("T")[0]; // 'YYYY-MM-DD'
            if (!grouped[date]) grouped[date] = 0;
            grouped[date]++;
        }

        return Object.entries(grouped).map(([date, count]) => ({
            date,
            count,
        })).sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    static async getExcelAnalytics(filters = {}) {
        const { default: ExcelJS } = await import('exceljs');
        const data = await RequestService.findByFilters(filters);
        const workbook = new ExcelJS.Workbook();

        // Summary
        const getAverage = (arr) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
        const calcStats = (items) => {
            const completed = items.filter(i => i.actual_completion_date);
            const slaList = completed.map(i => new Date(i.actual_completion_date) - new Date(i.date_submitted));
            const ratingList = items.map(i => i.rating).filter(r => r != null);
            const sla = getAverage(slaList.map(ms => ms / 1000 / 60));
            const rating = getAverage(ratingList);
            const overdue = completed.filter(i => {
                const expected = i.sla_minutes ? new Date(i.date_submitted).getTime() + i.sla_minutes * 60000 : null;
                return expected && new Date(i.actual_completion_date).getTime() > expected;
            });
            return { count: items.length, sla, rating, overdue: overdue.length };
        };

        const summary = calcStats(data);
        const summarySheet = workbook.addWorksheet("Summary");
        summarySheet.addRows([
            ["Metric", "Value"],
            ["Total Requests", summary.count],
            ["Average SLA (min)", summary.sla],
            ["Average Rating", summary.rating],
            ["Overdue Requests", summary.overdue]
        ]);
        summarySheet.getRow(1).font = { bold: true };

        // Groupings
        const groupings = {
            "By Office": {},
            "By Executor": {},
            "By Category": {},
            "By Date": {}
        };

        for (const r of data) {
            const keys = {
                "By Office": r.office_id || 'Unknown',
                "By Executor": r.executor_id || 'Unassigned',
                "By Category": r.category_id || 'Uncategorized',
                "By Date": r.created_date ? new Date(r.created_date).toLocaleDateString('en-CA') : 'Unknown'
            };

            for (const key in groupings) {
                if (!groupings[key][keys[key]]) groupings[key][keys[key]] = [];
                groupings[key][keys[key]].push(r);
            }
        }

        for (const [sheetName, groupData] of Object.entries(groupings)) {
            const hasData = Object.values(groupData).some(list => list.length > 0);
            if (!hasData) continue;
            const sheet = workbook.addWorksheet(sheetName.replace(/[\[\]\*\/\\\?\:]/g, '').slice(0, 31));
            sheet.addRow(["Entity", "Requests", "Avg SLA (min)", "Avg Rating", "Overdue"]);
            sheet.getRow(1).font = { bold: true };
            for (const [entity, items] of Object.entries(groupData)) {
                const { count, sla, rating, overdue } = calcStats(items);
                sheet.addRow([String(entity), count, sla, rating, overdue]);
            }
        }

        // Raw sheet
        const rawSheet = workbook.addWorksheet("RequestsRaw");
        const headers = [
            'ID', 'Тип запроса', 'Заголовок', 'Описание', 'Клиент ID',
            'Офис ID', 'Детали локации', 'Статус', 'Категория ID', 'Сложность',
            'SLA(минут)', 'Исполнитель ID', 'План ID', 'Фактическая дата завершения',
            'Причина отклонения', 'Комментарий', 'Дата подачи', 'Локация',
            'Дата создания', 'Оценка'
        ];
        rawSheet.addRow(headers);
        rawSheet.getRow(1).font = { bold: true };

        data.forEach(r => {
            const values = [
                r.id, r.request_type, r.title, r.description, r.client_id,
                r.office_id, r.location_detail, r.status, r.category_id, r.complexity,
                typeof r.sla === 'number' ? r.sla :
                typeof r.sla === 'string' && r.sla.endsWith('h') ? parseInt(r.sla) * 60 : '',
                r.executor_id, r.plan_id,
                r.actual_completion_date ? new Date(r.actual_completion_date).toLocaleDateString('en-CA') : '',
                r.rejection_reason, r.comment,
                r.date_submitted ? new Date(r.date_submitted).toLocaleDateString('en-CA') : '',
                r.location,
                r.created_date ? new Date(r.created_date).toLocaleDateString('en-CA') : '',
                r.rating
            ];
            rawSheet.addRow(values);
        });

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }

    static async getCSVAnalytics(filters = {}) {
        const data = await RequestService.findByFilters(filters);
        const fields = [
            'id', 'request_type', 'title', 'description', 'client_id',
            'office_id', 'location_detail', 'status', 'category_id', 'complexity',
            'sla', 'executor_id', 'plan_id', 'actual_completion_date',
            'rejection_reason', 'comment', 'date_submitted', 'location',
            'created_date', 'rating'
        ];
        const parser = new Parser({ fields });
        return parser.parse(data);
    }
}

export default AnalyticService;
