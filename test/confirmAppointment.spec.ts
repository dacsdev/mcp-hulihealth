import { describe, it, expect } from 'vitest';
import { confirmAppointmentSchema } from '../src/tools/confirmAppointment';

describe('confirmAppointmentSchema', () => {
  it('validates event_id', () => {
    const result = confirmAppointmentSchema.safeParse({ event_id: '1' });
    expect(result.success).toBe(true);
  });
});
