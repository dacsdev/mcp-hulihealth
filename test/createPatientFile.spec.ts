import { describe, it, expect } from 'vitest';
import { createPatientFileSchema } from '../src/tools/createPatientFile';

describe('createPatientFileSchema', () => {
  it('accepts data object', () => {
    const result = createPatientFileSchema.safeParse({ data: { personalData: { firstName: 'Joe' } } });
    expect(result.success).toBe(true);
  });
});
