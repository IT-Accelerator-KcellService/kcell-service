import { z } from 'zod';

export const OfficeDto = z.object({
    name: z.string().nonempty("Name is required"),
    address: z.string().nonempty("Address is required"),
    city: z.string().nonempty("City is required"),
});

export const UpdateOfficeDto = OfficeDto.partial();
