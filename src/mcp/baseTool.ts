import { ZodSchema } from 'zod';

/**
 * Base class that every MCP tool should extend.
 * Provides input validation via Zod.
 *
 * @template I Input parameter type
 * @template O Output result type
 */
export abstract class MCPTool<I, O> {
  abstract execute(params: I): Promise<O>;
  abstract getInputSchema(): ZodSchema<I>;
  abstract getOutputSchema(): ZodSchema<O>;

  /**
   * Validates unknown parameters according to the input schema.
   *
   * @param params - Raw parameters received from the MCP runtime
   * @returns The validated input object
   */
  validate(params: unknown): I {
    return this.getInputSchema().parse(params);
  }
}
