import { z } from 'zod';
import { huliClient } from '../services/huliClient.js';
import { ClinicList } from '../mcp/schema.js';

export const getClinicsSchema = z.object({});

export type GetClinicsParams = z.infer<typeof getClinicsSchema>;

export const getClinics = {
  name: 'obtener_clinicas',
  description: `Returns the list of clinics available to the organization.`,
  parameters: getClinicsSchema,
  async execute(_: GetClinicsParams): Promise<ClinicList> {
    return huliClient.getClinics();
  },
};
export type GetClinicsTool = typeof getClinics;
export default getClinics;
