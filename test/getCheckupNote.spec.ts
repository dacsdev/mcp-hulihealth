import { describe, it, expect } from 'vitest';
import { getCheckupNoteSchema } from '../src/tools/getCheckupNote';

describe('getCheckupNoteSchema', () => {
  it('validates event_id', () => {
    const result = getCheckupNoteSchema.safeParse({ event_id: '1' });
    expect(result.success).toBe(true);
  });
});
