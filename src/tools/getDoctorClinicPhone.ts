import { z } from 'zod';
import { huliClient } from '../services/huliClient.js';
import { DoctorClinicPhone } from '../mcp/schema.js';

export const getDoctorClinicPhoneSchema = z.object({
  doctor_id: z.string(),
  clinic_id: z.string(),
});

export type GetDoctorClinicPhoneParams = z.infer<typeof getDoctorClinicPhoneSchema>;

export const getDoctorClinicPhone = {
  name: 'get_doctor_clinic_phone',
  description: `Retrieves the doctor's phone numbers for a specific clinic.`,
  parameters: getDoctorClinicPhoneSchema,
  async execute(params: GetDoctorClinicPhoneParams): Promise<DoctorClinicPhone> {
    return huliClient.getDoctorClinicPhone(params.doctor_id, params.clinic_id);
  },
};
export type GetDoctorClinicPhoneTool = typeof getDoctorClinicPhone;

export default getDoctorClinicPhone;
