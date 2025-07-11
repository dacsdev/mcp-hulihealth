import { describe, it, expect } from 'vitest';
import { getDoctorByUserSchema } from '../src/tools/getDoctorByUser';

describe('getDoctorByUserSchema', () => {
  it('requires user_id', () => {
    const result = getDoctorByUserSchema.safeParse({ user_id: '123' });
    expect(result.success).toBe(true);
  });
});

