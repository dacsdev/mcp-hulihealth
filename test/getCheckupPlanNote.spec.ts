import { describe, it, expect } from 'vitest';
import { getCheckupPlanNoteSchema } from '../src/tools/getCheckupPlanNote';

describe('getCheckupPlanNoteSchema', () => {
  it('validates event_id', () => {
    const result = getCheckupPlanNoteSchema.safeParse({ event_id: '1' });
    expect(result.success).toBe(true);
  });
});
