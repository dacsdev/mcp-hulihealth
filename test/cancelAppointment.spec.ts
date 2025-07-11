import { describe, it, expect } from 'vitest';
import { cancelAppointmentSchema } from '../src/tools/cancelAppointment';

describe('cancelAppointmentSchema', () => {
  it('validates required fields', () => {
    const result = cancelAppointmentSchema.safeParse({
      event_id: '1',
    });
    expect(result.success).toBe(true);
  });
});
