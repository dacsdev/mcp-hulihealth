import { describe, it, expect } from 'vitest';
import { getCheckupPhysicalNoteSchema } from '../src/tools/getCheckupPhysicalNote';

describe('getCheckupPhysicalNoteSchema', () => {
  it('validates event_id', () => {
    const result = getCheckupPhysicalNoteSchema.safeParse({ event_id: '1' });
    expect(result.success).toBe(true);
  });
});
