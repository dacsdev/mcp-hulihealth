import { describe, it, expect } from 'vitest';
import { getOrganizationSchema } from '../src/tools/getOrganization';

describe('getOrganizationSchema', () => {
  it('accepts optional expand', () => {
    const result = getOrganizationSchema.safeParse({ expand: 'AUTHORIZATION' });
    expect(result.success).toBe(true);
  });
});

