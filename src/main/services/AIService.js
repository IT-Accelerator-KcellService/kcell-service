// services/AIService.js
import axios from 'axios'

export default {
    async analyzeRequest(request, photos = []) {
        const photoDescriptions = photos.length > 0
            ? photos.map((p, i) => `Фото ${i + 1}: ${p.photo_url}`).join('\n') : "Нет прикреплённых фото.";

        const prompt = `
Ты — помощник службы поддержки. Клиент прислал заявку:
Описание: "${request.description}"
Фото:
${photoDescriptions}

На основе этого определи:
- Нужно ли отклонить заявку (если это спам, неадекват или неполноценная заявка)
- Если не отклонять, то выбери:
  • complexity: 'simple', 'medium', 'complex'
  • sla: '1h', '4h', '8h', '1d', '3d', '1w'
Ответ верни строго в формате JSON:

{
  "status": "awaiting_assignment" | "rejected",
  "rejection_reason": "...", // если rejected
  "complexity": "...",
  "sla": "...",
}
`;

        try {
            const response = await axios.post(
                process.env.CHAT_API_URL,
                {
                    model: "deepseek-ai/DeepSeek-R1-Turbo",
                    messages: [
                        {
                            role: "system",
                            content: "Ты должен отвечать только в формате JSON, без пояснений, без тегов или комментариев."
                        },
                        {role: "user", content: prompt}
                    ],
                    temperature: 0.3
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.API_TOKEN}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const content = response.data.choices[0].message.content;
            let jsonText = content.trim();

            try {
                const start = jsonText.indexOf("{");
                const end = jsonText.lastIndexOf("}");
                if (start === -1 || end === -1) {
                    throw new Error("JSON not found in AI response");
                }

                jsonText = jsonText.slice(start, end + 1);

                return JSON.parse(jsonText);
            } catch (error) {
                console.error("AI analysis error:", content); // можно залогировать весь текст
                throw new Error("AI analysis failed");
            }

        }catch (error) {
            throw new Error("AI analysis failed");
        }

    }
}
