import { z } from 'zod';
import { huliClient } from '../services/huliClient.js';
import { Doctor } from '../mcp/schema.js';

export const getDoctorSchema = z.object({
  doctor_id: z.string(),
});

export type GetDoctorParams = z.infer<typeof getDoctorSchema>;

export const getDoctor = {
  name: 'get_doctor',
  description: `Retrieves doctor details by doctor ID.`,
  parameters: getDoctorSchema,
  async execute(params: GetDoctorParams): Promise<Doctor> {
    return huliClient.getDoctorById(params.doctor_id);
  },
};
export type GetDoctorTool = typeof getDoctor;

export default getDoctor;
