import { z } from 'zod';

export const UserDto = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    full_name: z.string().nonempty("Full name is required"),
    office_id: z.number({ required_error: "Office ID is required" }),
    role: z.enum(["client", "department-head", "executor"]),
});

export const UpdateUserDto = UserDto.partial();
