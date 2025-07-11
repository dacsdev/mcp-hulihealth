import { describe, it, expect } from 'vitest';
import { getAppointmentsSchema } from '../src/tools/getAppointments';

describe('getAppointmentsSchema', () => {
  it('requires doctor_id or patient_file_id', () => {
    const result = getAppointmentsSchema.safeParse({ doctor_id: '1', from: '2025-01-01T00:00:00Z' });
    expect(result.success).toBe(true);
  });
});
