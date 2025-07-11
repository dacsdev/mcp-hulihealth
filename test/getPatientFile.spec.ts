import { describe, it, expect } from 'vitest';
import { getPatientFileSchema } from '../src/tools/getPatientFile';

describe('getPatientFileSchema', () => {
  it('requires patient_file_id', () => {
    const result = getPatientFileSchema.safeParse({ patient_file_id: '123' });
    expect(result.success).toBe(true);
  });
});
