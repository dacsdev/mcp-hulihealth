import { describe, it, expect } from 'vitest';
import { scheduleAppointmentSchema } from '../src/tools/scheduleAppointment';

describe('scheduleAppointmentSchema', () => {
  it('validates required fields', () => {
    const result = scheduleAppointmentSchema.safeParse({
      id_doctor: 1,
      id_clinic: 2,
      start_date: '2025-01-01',
      time_from: '09:00:00',
    });
    expect(result.success).toBe(true);
  });
});
