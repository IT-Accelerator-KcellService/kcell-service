import z from 'zod';

export const AdminWorkerRequestStatus = z.object({
    status: z.enum(['rejected', 'awaiting_assignment']),
    complexity: z.enum(['simple', 'medium', 'complex']).optional(),
    sla: z.string().nonempty().optional(),
    category_id: z.number().gt(0).optional(),
    rejection_reason: z.string().nonempty().optional(),
});