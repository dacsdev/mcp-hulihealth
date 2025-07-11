import { describe, it, expect } from 'vitest';
import { getClinicSchema } from '../src/tools/getClinic';

describe('getClinicSchema', () => {
  it('requires clinic_id', () => {
    const result = getClinicSchema.safeParse({ clinic_id: '1' });
    expect(result.success).toBe(true);
  });
});
