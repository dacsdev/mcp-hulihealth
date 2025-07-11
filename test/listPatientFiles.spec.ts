import { describe, it, expect } from 'vitest';
import { listPatientFilesSchema } from '../src/tools/listPatientFiles';

describe('listPatientFilesSchema', () => {
  it('accepts optional parameters', () => {
    const result = listPatientFilesSchema.safeParse({ query: 'John', limit: 5, offset: 0 });
    expect(result.success).toBe(true);
  });
});
