import { describe, it, expect } from 'vitest';
import { getCheckupSleepPatternSchema } from '../src/tools/getCheckupSleepPattern';

describe('getCheckupSleepPatternSchema', () => {
  it('validates event_id', () => {
    const result = getCheckupSleepPatternSchema.safeParse({ event_id: '1' });
    expect(result.success).toBe(true);
  });
});
