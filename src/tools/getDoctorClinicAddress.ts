import { z } from 'zod';
import { huliClient } from '../services/huliClient';
import { DoctorClinicAddress } from '../mcp/schema';

export const getDoctorClinicAddressSchema = z.object({
  doctor_id: z.string(),
  clinic_id: z.string(),
});

export type GetDoctorClinicAddressParams = z.infer<typeof getDoctorClinicAddressSchema>;

export const getDoctorClinicAddress = {
  name: 'get_doctor_clinic_address',
  description: `Retrieves the doctor's clinic address for a specific clinic.`,
  parameters: getDoctorClinicAddressSchema,
  async execute(params: GetDoctorClinicAddressParams): Promise<DoctorClinicAddress> {
    return huliClient.getDoctorClinicAddress(params.doctor_id, params.clinic_id);
  },
};
export type GetDoctorClinicAddressTool = typeof getDoctorClinicAddress;

