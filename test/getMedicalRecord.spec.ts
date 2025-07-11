import { describe, it, expect } from 'vitest';
import { getMedicalRecordSchema } from '../src/tools/getMedicalRecord';

describe('getMedicalRecordSchema', () => {
  it('validates patient_id and owner_id', () => {
    const result = getMedicalRecordSchema.safeParse({ patient_id: '1', owner_id: '2' });
    expect(result.success).toBe(true);
  });
});
