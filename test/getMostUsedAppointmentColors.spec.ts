import { describe, it, expect } from 'vitest';
import { getMostUsedAppointmentColorsSchema } from '../src/tools/getMostUsedAppointmentColors';

describe('getMostUsedAppointmentColorsSchema', () => {
  it('requires doctor_id or patient_file_id', () => {
    const result = getMostUsedAppointmentColorsSchema.safeParse({ doctor_id: '1' });
    expect(result.success).toBe(true);
  });
});
