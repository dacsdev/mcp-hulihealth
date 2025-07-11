import { describe, it, expect } from 'vitest';
import { getCheckupLastMenstrualCycleSchema } from '../src/tools/getCheckupLastMenstrualCycle';

describe('getCheckupLastMenstrualCycleSchema', () => {
  it('validates event_id', () => {
    const result = getCheckupLastMenstrualCycleSchema.safeParse({ event_id: '1' });
    expect(result.success).toBe(true);
  });
});
