import { z } from 'zod';
import { huliClient } from '../services/huliClient.js';
import { CheckupSystematicExamination } from '../mcp/schema.js';

export const getCheckupSystematicExaminationSchema = z.object({
  event_id: z.string(),
});

export type GetCheckupSystematicExaminationParams = z.infer<typeof getCheckupSystematicExaminationSchema>;

export const getCheckupSystematicExamination = {
  name: 'get_checkup_systematic_examination',
  description: `Retrieves systematic examination details from a checkup.`,
  parameters: getCheckupSystematicExaminationSchema,
  async execute(params: GetCheckupSystematicExaminationParams): Promise<CheckupSystematicExamination> {
    return huliClient.getCheckupSystematicExamination(params.event_id);
  },
};
export type GetCheckupSystematicExaminationTool = typeof getCheckupSystematicExamination;
export default getCheckupSystematicExamination;
