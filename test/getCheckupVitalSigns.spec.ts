import { describe, it, expect } from 'vitest';
import { getCheckupVitalSignsSchema } from '../src/tools/getCheckupVitalSigns';

describe('getCheckupVitalSignsSchema', () => {
  it('validates event_id', () => {
    const result = getCheckupVitalSignsSchema.safeParse({ event_id: '1' });
    expect(result.success).toBe(true);
  });
});
