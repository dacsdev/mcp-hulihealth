import { z } from 'zod';
import { huliClient } from '../services/huliClient.js';
import { CheckupReviewOfSystems } from '../mcp/schema.js';

export const getCheckupReviewOfSystemsSchema = z.object({
  event_id: z.string(),
});

export type GetCheckupReviewOfSystemsParams = z.infer<typeof getCheckupReviewOfSystemsSchema>;

export const getCheckupReviewOfSystems = {
  name: 'get_checkup_review_of_systems',
  description: `Retrieves review of systems data from a checkup.`,
  parameters: getCheckupReviewOfSystemsSchema,
  async execute(params: GetCheckupReviewOfSystemsParams): Promise<CheckupReviewOfSystems> {
    return huliClient.getCheckupReviewOfSystems(params.event_id);
  },
};
export type GetCheckupReviewOfSystemsTool = typeof getCheckupReviewOfSystems;
export default getCheckupReviewOfSystems;
