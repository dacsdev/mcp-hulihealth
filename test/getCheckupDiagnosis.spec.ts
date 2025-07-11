import { describe, it, expect } from 'vitest';
import { getCheckupDiagnosisSchema } from '../src/tools/getCheckupDiagnosis';

describe('getCheckupDiagnosisSchema', () => {
  it('validates event_id', () => {
    const result = getCheckupDiagnosisSchema.safeParse({ event_id: '1' });
    expect(result.success).toBe(true);
  });
});
