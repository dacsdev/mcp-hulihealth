import { describe, it, expect } from 'vitest';
import { getAvailabilitySchema } from '../src/tools/getAvailability';

describe('getAvailabilitySchema', () => {
  it('validates required fields', () => {
    const result = getAvailabilitySchema.safeParse({
      doctor_id: '1',
      clinic_id: '2292',
      from: '2025-07-01T00:00:00Z',
      to: '2025-07-07T00:00:00Z',
    });
    expect(result.success).toBe(true);
  });
});
