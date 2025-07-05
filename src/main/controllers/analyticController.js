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

    // static emailAnalytics = asyncHandler(async (req, res) => {
    //     const { emails = [] } = req.body;
    //     if (!emails.length || emails.length > 3) {
    //         return res.status(400).json({ message: '1 to 3 emails required' });
    //     }
    //
    //     const data = await RequestService.find({});
    //     const workbook = new ExcelJS.Workbook();
    //     const sheet = workbook.addWorksheet('Analytics');
    //
    //     sheet.columns = [
    //         { header: 'ID', key: 'id', width: 10 },
    //         { header: 'Тип', key: 'request_type', width: 15 },
    //         { header: 'Офис', key: 'office', width: 15 },
    //         { header: 'Статус', key: 'status', width: 15 },
    //         { header: 'Дата подачи', key: 'date_submitted', width: 20 },
    //     ];
    //
    //     data.forEach(r => {
    //         sheet.addRow({
    //             id: r.id,
    //             request_type: r.request_type,
    //             office: r.office,
    //             status: r.status,
    //             date_submitted: r.date_submitted,
    //         });
    //     });
    //
    //     const buffer = await workbook.xlsx.writeBuffer();
    //
    //     const transporter = nodemailer.createTransport({
    //         service: 'gmail',
    //         auth: {
    //             user: 'your_email@gmail.com',
    //             pass: 'your_password_or_app_password',
    //         },
    //     });
    //
    //     const mailOptions = {
    //         from: 'your_email@gmail.com',
    //         to: emails.join(','),
    //         subject: 'Отчет по заявкам',
    //         text: 'В приложении файл с аналитикой.',
    //         attachments: [
    //             {
    //                 filename: 'analytics.xlsx',
    //                 content: buffer,
    //                 contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //             },
    //         ],
    //     };
    //
    //     transporter.sendMail(mailOptions, (err, info) => {
    //         if (err) return res.status(500).json({ error: err.message });
    //         res.json({ message: 'Отчет отправлен', info });
    //     });
    // })
}

export default AnalyticController;