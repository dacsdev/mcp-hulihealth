import { z } from 'zod';
import { huliClient } from '../services/huliClient.js';
import { Patient } from '../mcp/schema.js';

export const getPatientByExternalIdSchema = z.object({
  external_id: z.string(),
});

export type GetPatientByExternalIdParams = z.infer<typeof getPatientByExternalIdSchema>;

export const getPatientByExternalId = {
  name: 'buscar_paciente_externo',
  description: `Finds a patient using an external identifier.`,
  parameters: getPatientByExternalIdSchema,
  async execute(params: GetPatientByExternalIdParams): Promise<Patient> {
    return huliClient.getPatientByExternalId(params.external_id);
  },
};
export type GetPatientByExternalIdTool = typeof getPatientByExternalId;
export default getPatientByExternalId;
