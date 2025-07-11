import { describe, it, expect } from 'vitest';
import { getCheckupSystematicExaminationSchema } from '../src/tools/getCheckupSystematicExamination';

describe('getCheckupSystematicExaminationSchema', () => {
  it('validates event_id', () => {
    const result = getCheckupSystematicExaminationSchema.safeParse({ event_id: '1' });
    expect(result.success).toBe(true);
  });
});
