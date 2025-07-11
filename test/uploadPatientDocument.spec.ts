import { describe, it, expect } from 'vitest';
import { uploadPatientDocumentSchema } from '../src/tools/uploadPatientDocument';

describe('uploadPatientDocumentSchema', () => {
  it('requires all fields', () => {
    const result = uploadPatientDocumentSchema.safeParse({ patient_file_id: '1', owner_id: '2', data: { file: 'a', filename: 'b.pdf' } });
    expect(result.success).toBe(true);
  });
});
