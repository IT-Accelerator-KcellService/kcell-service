import { z } from 'zod';

export const UserDto = z.object({
    email: z.string().email("Invalid email format"),
    full_name: z.string().nonempty("Full name is required"),
    role: z.enum(["client", "department-head", "executor"]),
    specialty: z.string().nonempty("Specialty is required"),
    office_id: z.number().gt(0).min(1, "Office ID is required")
});

export const UpdateUserDto = UserDto.partial();
