import { describe, it, expect } from 'vitest';
import { getPatientByExternalIdSchema } from '../src/tools/getPatientByExternalId';

describe('getPatientByExternalIdSchema', () => {
  it('requires external_id', () => {
    const result = getPatientByExternalIdSchema.safeParse({ external_id: 'abc' });
    expect(result.success).toBe(true);
  });
});
