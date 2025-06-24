import { z } from 'zod';

export const ServiceCategoryDto = z.object({
    name: z.string().nonempty("Name is required"),
});