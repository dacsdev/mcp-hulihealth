import { z } from 'zod';
import { huliClient } from '../services/huliClient';
import { CheckupCustomQuestions } from '../mcp/schema';

export const getCheckupCustomQuestionsSchema = z.object({
  event_id: z.string(),
});

export type GetCheckupCustomQuestionsParams = z.infer<typeof getCheckupCustomQuestionsSchema>;

export const getCheckupCustomQuestions = {
  name: 'get_checkup_custom_questions',
  description: `Retrieves custom questions and answers from a checkup.`,
  parameters: getCheckupCustomQuestionsSchema,
  async execute(params: GetCheckupCustomQuestionsParams): Promise<CheckupCustomQuestions> {
    return huliClient.getCheckupCustomQuestions(params.event_id);
  },
};
export type GetCheckupCustomQuestionsTool = typeof getCheckupCustomQuestions;
