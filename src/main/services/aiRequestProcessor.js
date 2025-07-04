import { Request } from "../models/init.js";
import RequestPhotoService from "./requestPhotoService.js";
import AIService from "../services/AIService.js";
import NotificationService from "./notificationService.js";

export async function processRequestsByCron() {
    const requests = await Request.findAll({
        where: {
            status: "in_progress",
            request_type: "normal"
        }
    });

    for (const request of requests) {
        try {
            const photos = await RequestPhotoService.getPhotosByRequestId(request.id);
            const aiResult = await AIService.analyzeRequest(request, photos);

            if (aiResult.status === "rejected") {
                await request.destroy();
                await NotificationService.sendNotification({
                    userId: request.client_id,
                    type: "reject_request",
                    content: aiResult.rejection_reason || "Автоматически отклонено системой"
                });
                console.log(`Request ${request.id} rejected`);
            } else if (aiResult.status === "awaiting_assignment") {
                request.status = "awaiting_assignment";
                request.complexity = aiResult.complexity;
                request.sla = aiResult.sla;
                request.category_id = aiResult.category_id;
                await request.save();

                await NotificationService.sendNotification({
                    userId: request.client_id,
                    requestId: request.id,
                    type: "awaiting_assignment"
                });
                console.log(`Request ${request.id} updated by AI`);
            }
        } catch (err) {
            console.error(`AI analysis failed for request ${request.id}:`, err.message);
        }
    }
}
