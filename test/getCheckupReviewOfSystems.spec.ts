import { describe, it, expect } from 'vitest';
import { getCheckupReviewOfSystemsSchema } from '../src/tools/getCheckupReviewOfSystems';

describe('getCheckupReviewOfSystemsSchema', () => {
  it('validates event_id', () => {
    const result = getCheckupReviewOfSystemsSchema.safeParse({ event_id: '1' });
    expect(result.success).toBe(true);
  });
});
