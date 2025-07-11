import { z } from 'zod';
import { huliClient } from '../services/huliClient';
import { Doctor } from '../mcp/schema';

export const getDoctorByUserSchema = z.object({
  user_id: z.string(),
});

export type GetDoctorByUserParams = z.infer<typeof getDoctorByUserSchema>;

export const getDoctorByUser = {
  name: 'get_doctor_by_user',
  description: `Retrieves doctor information using the user ID.`,
  parameters: getDoctorByUserSchema,
  async execute(params: GetDoctorByUserParams): Promise<Doctor> {
    return huliClient.getDoctorByUser(params.user_id);
  },
};
export type GetDoctorByUserTool = typeof getDoctorByUser;

