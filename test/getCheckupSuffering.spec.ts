import { describe, it, expect } from 'vitest';
import { getCheckupSufferingSchema } from '../src/tools/getCheckupSuffering';

describe('getCheckupSufferingSchema', () => {
  it('validates event_id', () => {
    const result = getCheckupSufferingSchema.safeParse({ event_id: '1' });
    expect(result.success).toBe(true);
  });
});
