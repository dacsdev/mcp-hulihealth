import { describe, it, expect } from 'vitest';
import { updateAppointmentSchema } from '../src/tools/updateAppointment';

describe('updateAppointmentSchema', () => {
  it('validates nested data', () => {
    const result = updateAppointmentSchema.safeParse({
      event_id: '1',
      data: { notes: 'ok' },
    });
    expect(result.success).toBe(true);
  });
});
