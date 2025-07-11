import { describe, it, expect } from 'vitest';
import { getDoctorSchema } from '../src/tools/getDoctor';

describe('getDoctorSchema', () => {
  it('requires doctor_id', () => {
    const result = getDoctorSchema.safeParse({ doctor_id: '123' });
    expect(result.success).toBe(true);
  });
});

