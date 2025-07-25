import { z } from 'zod';

export const UserDto = z.object({
    email: z.string().email("Invalid email format"),
    full_name: z.string().nonempty("Full name is required"),
    role: z.enum(["client", "department-head", "executor", "admin-worker", "manager"]),
    specialty: z.string().nonempty("Specialty is required").optional(),
    office_id: z.number().gt(0).min(1, "Office ID is required").optional(),
});

export const UpdateUserDto = UserDto.partial();
