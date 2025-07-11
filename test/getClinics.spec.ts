import { describe, it, expect } from 'vitest';
import { getClinicsSchema } from '../src/tools/getClinics';

describe('getClinicsSchema', () => {
  it('accepts empty parameters', () => {
    const result = getClinicsSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});
