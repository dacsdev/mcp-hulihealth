import { describe, it, expect } from 'vitest';
import { getCheckupCustomQuestionsSchema } from '../src/tools/getCheckupCustomQuestions';

describe('getCheckupCustomQuestionsSchema', () => {
  it('validates event_id', () => {
    const result = getCheckupCustomQuestionsSchema.safeParse({ event_id: '1' });
    expect(result.success).toBe(true);
  });
});
