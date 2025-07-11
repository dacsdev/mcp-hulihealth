import { describe, it, expect } from 'vitest';
import { getCheckupReasonOfVisitSchema } from '../src/tools/getCheckupReasonOfVisit';

describe('getCheckupReasonOfVisitSchema', () => {
  it('validates event_id', () => {
    const result = getCheckupReasonOfVisitSchema.safeParse({ event_id: '1' });
    expect(result.success).toBe(true);
  });
});
