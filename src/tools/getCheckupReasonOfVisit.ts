import { z } from 'zod';
import { huliClient } from '../services/huliClient.js';
import { CheckupReasonOfVisit } from '../mcp/schema.js';

export const getCheckupReasonOfVisitSchema = z.object({
  event_id: z.string(),
});

export type GetCheckupReasonOfVisitParams = z.infer<typeof getCheckupReasonOfVisitSchema>;

export const getCheckupReasonOfVisit = {
  name: 'get_checkup_reason_of_visit',
  description: `Retrieves the reason of visit from a checkup.`,
  parameters: getCheckupReasonOfVisitSchema,
  async execute(params: GetCheckupReasonOfVisitParams): Promise<CheckupReasonOfVisit> {
    return huliClient.getCheckupReasonOfVisit(params.event_id);
  },
};
export type GetCheckupReasonOfVisitTool = typeof getCheckupReasonOfVisit;
export default getCheckupReasonOfVisit;
