import { describe, it, expect } from 'vitest';
import { getDoctorClinicAddressSchema } from '../src/tools/getDoctorClinicAddress';

describe('getDoctorClinicAddressSchema', () => {
  it('validates required fields', () => {
    const result = getDoctorClinicAddressSchema.safeParse({
      doctor_id: '1',
      clinic_id: '2292',
    });
    expect(result.success).toBe(true);
  });
});

