import RequestService from "../services/requestService.js";

class AnalyticService {

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
            const sheet = workbook.addWorksheet(sheetName.replace(/[\]*\\?:]/g, '').slice(0, 31));
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

        return await workbook.xlsx.writeBuffer();
    }
}

export default AnalyticService;
