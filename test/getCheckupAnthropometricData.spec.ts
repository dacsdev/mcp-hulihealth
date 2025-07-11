import { describe, it, expect } from 'vitest';
import { getCheckupAnthropometricDataSchema } from '../src/tools/getCheckupAnthropometricData';

describe('getCheckupAnthropometricDataSchema', () => {
  it('validates event_id', () => {
    const result = getCheckupAnthropometricDataSchema.safeParse({ event_id: '1' });
    expect(result.success).toBe(true);
  });
});
