import { describe, it, expect } from 'vitest';
import { getCheckupLabProcedureRequestSchema } from '../src/tools/getCheckupLabProcedureRequest';

describe('getCheckupLabProcedureRequestSchema', () => {
  it('validates event_id', () => {
    const result = getCheckupLabProcedureRequestSchema.safeParse({ event_id: '1' });
    expect(result.success).toBe(true);
  });
});
