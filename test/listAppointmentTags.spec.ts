import { describe, it, expect } from 'vitest';
import { listAppointmentTagsSchema } from '../src/tools/listAppointmentTags';

describe('listAppointmentTagsSchema', () => {
  it('accepts empty parameters', () => {
    const result = listAppointmentTagsSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});
