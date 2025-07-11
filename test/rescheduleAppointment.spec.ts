import { describe, it, expect } from 'vitest';
import { rescheduleAppointmentSchema } from '../src/tools/rescheduleAppointment';

describe('rescheduleAppointmentSchema', () => {
  it('validates required fields', () => {
    const result = rescheduleAppointmentSchema.safeParse({
      email: 'test@example.com',
      event_id: '1',
      start_date: '2025-01-01',
      time_from: '09:00:00',
    });
    expect(result.success).toBe(true);
  });
});
