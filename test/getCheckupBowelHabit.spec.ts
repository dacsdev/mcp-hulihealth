import { describe, it, expect } from 'vitest';
import { getCheckupBowelHabitSchema } from '../src/tools/getCheckupBowelHabit';

describe('getCheckupBowelHabitSchema', () => {
  it('validates event_id', () => {
    const result = getCheckupBowelHabitSchema.safeParse({ event_id: '1' });
    expect(result.success).toBe(true);
  });
});
