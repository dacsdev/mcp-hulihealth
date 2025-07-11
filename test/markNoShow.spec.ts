import { describe, it, expect } from 'vitest';
import { markNoShowSchema } from '../src/tools/markNoShow';

describe('markNoShowSchema', () => {
  it('validates event_id', () => {
    const result = markNoShowSchema.safeParse({ event_id: '1' });
    expect(result.success).toBe(true);
  });
});
