import { describe, it, expect } from 'vitest';
import { getAppointmentByIdSchema } from '../src/tools/getAppointmentById';

describe('getAppointmentByIdSchema', () => {
  it('validates event_id', () => {
    const result = getAppointmentByIdSchema.safeParse({ event_id: '1' });
    expect(result.success).toBe(true);
  });
});
