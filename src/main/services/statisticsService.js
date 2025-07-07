import {col, fn, literal} from 'sequelize';
import {Executor, Request, RequestRating} from '../models/init.js';

class StatisticsService {
    static async getClientStats(userId) {
        const requests = await Request.findAll({
            where: { client_id: userId },
            attributes: [
                [fn('COUNT', col('id')), 'totalRequests'],
                [fn('COUNT', literal(`CASE WHEN status IN ('in_progress', 'execution', 'assigned') THEN 1 END`)), 'activeRequests'],
                [fn('COUNT', literal(`CASE WHEN status = 'completed' THEN 1 END`)), 'doneRequests']
            ],
            raw: true
        });

        const averageRating = await RequestRating.findOne({
            attributes: [[fn('AVG', col('rating')), 'avg_rating']],
            where: { rated_by: userId },
            raw: true
        });

        return {
            totalRequests: parseInt(requests[0].totalRequests, 10),
            activeRequests: parseInt(requests[0].activeRequests, 10),
            doneRequests: parseInt(requests[0].doneRequests, 10),
            averageRating: parseFloat(averageRating.avg_rating || 0).toFixed(2)
        };
    }

    static async getAdminWorkerStats() {
        const [results] = await Request.findAll({
            attributes: [
                [fn('COUNT', col('id')), 'totalRequests'],
                [fn('COUNT', literal(`CASE WHEN status = 'in_progress' THEN 1 END`)), 'newRequests'],
                [fn('COUNT', literal(`CASE WHEN status = 'execution' THEN 1 END`)), 'inWork'],
                [fn('COUNT', literal(`CASE WHEN status = 'completed' THEN 1 END`)), 'completed'],
                [fn('COUNT', literal(`CASE WHEN status != 'completed' AND actual_completion_date > created_date + sla::interval THEN 1 END`)), 'overdue']
            ],
            raw: true
        });

        const typeCounts = await Request.findAll({
            attributes: ['request_type', [fn('COUNT', col('id')), 'count']],
            group: ['request_type'],
            raw: true
        });

        const requestTypeSummary = {};
        typeCounts.forEach((row) => {
            requestTypeSummary[row.request_type] = parseInt(row.count);
        });

        return {
            totalRequests: parseInt(results.totalRequests, 10),
            statusCounts: {
                new: parseInt(results.newRequests, 10),
                inWork: parseInt(results.inWork, 10),
                completed: parseInt(results.completed, 10),
                overdue: parseInt(results.overdue, 10)
            },
            requestTypeSummary
        };
    }

    static async getDepartmentHeadStats() {
        return await this.getAdminWorkerStats();
    };

    static async getExecutorStats(userId) {
        const executor = await Executor.findOne({
            where: { user_id: userId },
        });
        const [results] = await Request.findAll({
            attributes: [
                [fn('COUNT', col('id')), 'total'],
                [fn('COUNT', literal(`CASE WHEN request_type = 'urgent' THEN 1 END`)), 'urgent'],
                [fn('COUNT', literal(`CASE WHEN status = 'execution' THEN 1 END`)), 'inWork'],
                [fn('COUNT', literal(`CASE WHEN status = 'completed' THEN 1 END`)), 'completed'],
                [fn('COUNT', literal(`CASE WHEN status = 'completed' AND actual_completion_date <= created_date + sla::interval THEN 1 END`)), 'onTime'],
                [fn('COUNT', literal(`CASE WHEN status = 'completed' AND actual_completion_date > created_date + sla::interval THEN 1 END`)), 'late'],
                [fn('AVG', literal("EXTRACT(EPOCH FROM actual_completion_date - created_date) / 3600")), 'avgHours']
            ],
            where: { executor_id: executor.id },
            raw: true
        });

        const rating = await RequestRating.findOne({
            attributes: [[fn('AVG', col('rating')), 'avg_rating']],
            include: [{
                model: Request,
                where: { executor_id: userId },
                attributes: []
            }],
            raw: true
        });

        return {
            totalRequests: parseInt(results.total, 10),
            urgent: parseInt(results.urgent, 10),
            inWork: parseInt(results.inWork, 10),
            completed: parseInt(results.completed, 10),
            onTime: parseInt(results.onTime, 10),
            late: parseInt(results.late, 10),
            averageExecutionHours: Number(results.avgHours || 0).toFixed(2),
            averageRating: Number(rating.avg_rating || 0).toFixed(2)
        };
    };

    static async getManagerStats() {
        const requests = await Request.findAll({
            attributes: [
                [fn('DATE', col('created_date')), 'date'],
                'office_id',
                [fn('COUNT', col('id')), 'totalRequests'],
                [fn('COUNT', literal(`CASE WHEN status = 'completed' THEN 1 END`)), 'completedRequests'],
                [fn('COUNT', literal(`CASE WHEN request_type = 'urgent' AND status != 'completed' AND actual_completion_date > created_date + sla::interval THEN 1 END`)), 'overdueUrgentRequests'],
                [fn('COUNT', literal(`CASE WHEN request_type = 'normal' THEN 1 END`)), 'normalRequests'],
                [fn('COUNT', literal(`CASE WHEN request_type = 'urgent' THEN 1 END`)), 'urgentRequests'],
                [fn('COUNT', literal(`CASE WHEN request_type = 'planned' THEN 1 END`)), 'plannedRequests']
            ],
            group: [fn('DATE', col('created_date')), 'office_id'],
            order: [[fn('DATE', col('created_date')), 'ASC']],
            raw: true
        });

        const grouped = {};

        for (const r of requests) {
            const officeId = r.office_id;
            const date = r.date;

            if (!grouped[officeId]) grouped[officeId] = {};
            grouped[officeId][date] = {
                totalRequests: parseInt(r.totalRequests, 10),
                completedRequests: parseInt(r.completedRequests, 10),
                overdueUrgentRequests: parseInt(r.overdueUrgentRequests, 10),
                normalRequests: parseInt(r.normalRequests, 10),
                urgentRequests: parseInt(r.urgentRequests, 10),
                plannedRequests: parseInt(r.plannedRequests, 10)
            };
        }

        return Object.entries(grouped).map(([officeId, data]) => ({
            officeId: parseInt(officeId, 10),
            data
        }));
    }
}

export default StatisticsService;