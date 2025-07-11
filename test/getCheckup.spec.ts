import { describe, it, expect } from 'vitest';
import { getCheckupSchema } from '../src/tools/getCheckup';

describe('getCheckupSchema', () => {
  it('validates event_id', () => {
    const result = getCheckupSchema.safeParse({ event_id: '1' });
    expect(result.success).toBe(true);
  });
});
