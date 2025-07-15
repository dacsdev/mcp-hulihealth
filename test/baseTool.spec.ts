import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { MCPTool } from '../src/mcp/baseTool.js';

class EchoTool extends MCPTool<{ msg: string }, { result: string }> {
  getInputSchema() {
    return z.object({ msg: z.string() });
  }
  getOutputSchema() {
    return z.object({ result: z.string() });
  }
  async execute(params: { msg: string }) {
    return { result: params.msg };
  }
}

describe('MCPTool validate', () => {
  it('parses parameters', () => {
    const t = new EchoTool();
    const res = t.validate({ msg: 'hi' });
    expect(res).toEqual({ msg: 'hi' });
  });
});
