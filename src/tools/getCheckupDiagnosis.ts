import { z } from 'zod';
import { huliClient } from '../services/huliClient';
import { CheckupDiagnosis } from '../mcp/schema';

export const getCheckupDiagnosisSchema = z.object({
  event_id: z.string(),
});

export type GetCheckupDiagnosisParams = z.infer<typeof getCheckupDiagnosisSchema>;

export const getCheckupDiagnosis = {
  name: 'get_checkup_diagnosis',
  description: `Retrieves diagnosis information from a checkup.`,
  parameters: getCheckupDiagnosisSchema,
  async execute(params: GetCheckupDiagnosisParams): Promise<CheckupDiagnosis> {
    return huliClient.getCheckupDiagnosis(params.event_id);
  },
};
export type GetCheckupDiagnosisTool = typeof getCheckupDiagnosis;
