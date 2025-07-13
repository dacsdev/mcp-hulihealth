import { z } from 'zod';
import { huliClient } from '../services/huliClient.js';
import { CheckupLabProcedure } from '../mcp/schema.js';

export const getCheckupLabProcedureRequestSchema = z.object({
  event_id: z.string(),
});

export type GetCheckupLabProcedureRequestParams = z.infer<typeof getCheckupLabProcedureRequestSchema>;

export const getCheckupLabProcedureRequest = {
  name: 'get_checkup_lab_procedure_request',
  description: `Retrieves lab procedure requests from a checkup.`,
  parameters: getCheckupLabProcedureRequestSchema,
  async execute(params: GetCheckupLabProcedureRequestParams): Promise<CheckupLabProcedure> {
    return huliClient.getCheckupLabProcedureRequest(params.event_id);
  },
};
export type GetCheckupLabProcedureRequestTool = typeof getCheckupLabProcedureRequest;
export default getCheckupLabProcedureRequest;
