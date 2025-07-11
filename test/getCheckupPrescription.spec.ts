import { describe, it, expect } from 'vitest';
import { getCheckupPrescriptionSchema } from '../src/tools/getCheckupPrescription';

describe('getCheckupPrescriptionSchema', () => {
  it('validates event_id', () => {
    const result = getCheckupPrescriptionSchema.safeParse({ event_id: '1' });
    expect(result.success).toBe(true);
  });
});
