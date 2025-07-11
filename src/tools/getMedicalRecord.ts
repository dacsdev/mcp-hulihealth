import { z } from 'zod';
import { huliClient } from '../services/huliClient';
import { MedicalRecord } from '../mcp/schema';

export const getMedicalRecordSchema = z.object({
  patient_id: z.string(),
  owner_id: z.string(),
});

export type GetMedicalRecordParams = z.infer<typeof getMedicalRecordSchema>;

export const getMedicalRecord = {
  name: 'get_medical_record',
  description: `Retrieves a patient's full medical record.`,
  parameters: getMedicalRecordSchema,
  async execute(params: GetMedicalRecordParams): Promise<MedicalRecord> {
    return huliClient.getMedicalRecord(params.patient_id, params.owner_id);
  },
};
export type GetMedicalRecordTool = typeof getMedicalRecord;
