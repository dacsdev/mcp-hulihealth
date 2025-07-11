import { describe, it, expect } from 'vitest';
import { getPatientSchema } from '../src/tools/getPatient';

describe('getPatientSchema', () => {
  it('requires patient_file_id', () => {
    const result = getPatientSchema.safeParse({ patient_file_id: '1' });
    expect(result.success).toBe(true);
  });
});
