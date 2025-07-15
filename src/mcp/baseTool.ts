import { ZodSchema } from 'zod';

export abstract class MCPTool<I, O> {
  abstract execute(params: I): Promise<O>;
  abstract getInputSchema(): ZodSchema<I>;
  abstract getOutputSchema(): ZodSchema<O>;

  validate(params: unknown): I {
    return this.getInputSchema().parse(params);
  }
}
