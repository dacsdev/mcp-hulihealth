import { z } from 'zod';
import { huliClient } from '../services/huliClient.js';
import { CheckupPrescription } from '../mcp/schema.js';

export const getCheckupPrescriptionSchema = z.object({
  event_id: z.string(),
});

export type GetCheckupPrescriptionParams = z.infer<typeof getCheckupPrescriptionSchema>;

export const getCheckupPrescription = {
  name: 'get_checkup_prescription',
  description: `Retrieves prescription details from a checkup.`,
  parameters: getCheckupPrescriptionSchema,
  async execute(params: GetCheckupPrescriptionParams): Promise<CheckupPrescription> {
    return huliClient.getCheckupPrescription(params.event_id);
  },
};
export type GetCheckupPrescriptionTool = typeof getCheckupPrescription;
export default getCheckupPrescription;
