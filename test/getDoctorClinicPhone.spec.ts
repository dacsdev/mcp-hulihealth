import { describe, it, expect } from 'vitest';
import { getDoctorClinicPhoneSchema } from '../src/tools/getDoctorClinicPhone';

describe('getDoctorClinicPhoneSchema', () => {
  it('validates required fields', () => {
    const result = getDoctorClinicPhoneSchema.safeParse({
      doctor_id: '1',
      clinic_id: '2292',
    });
    expect(result.success).toBe(true);
  });
});

