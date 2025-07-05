import {asyncHandler} from "../middleware/asyncHandler.js";
import AnalyticService from "../services/analyticService.js";

class AnalyticController {

    static exportAnalytics = asyncHandler(async (req, res) => {
        const { format = 'xlsx', office_id, from, to } = req.query;

        const filters = {};
        if (office_id) filters.office_id = office_id;
        if (from || to) {
            filters.created_date = {};
            if (from) filters.created_date.$gte = new Date(from);
            if (to) filters.created_date.$lte = new Date(to);
        }

        if (format === 'xlsx') {
            const buffer = await AnalyticService.getExcelAnalytics(filters);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=analytics.xlsx');
            return res.send(buffer);
        }

        // Сохраняем xlsx во временный файл
        const buffer = await AnalyticService.getExcelAnalytics(filters);
        const fs = await import('fs');
        const path = await import('path');
        const os = await import('os');
        const tempDir = os.tmpdir();
        const filePath = path.join(tempDir, 'analytics.xlsx');
        await fs.promises.writeFile(filePath, buffer);

        // Возвращаем Power BI шаблон (предварительно загруженный)
        const templatePath = path.resolve('src/main/assets/Kcell.pbix'); // положи туда шаблон
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', 'attachment; filename=analytics_template.pbix');
        return res.sendFile(templatePath);
    });
}

export default AnalyticController;