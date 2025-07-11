import { z } from 'zod';
import { huliClient } from '../services/huliClient';
import { OrganizationResponse } from '../mcp/schema';

export const getOrganizationSchema = z.object({
  expand: z.enum(['AUTHORIZATION']).optional(),
});

export type GetOrganizationParams = z.infer<typeof getOrganizationSchema>;

export const getOrganization = {
  name: 'get_organization',
  description: `Returns organization information. Include \`expand=AUTHORIZATION\` to retrieve authorization details.`,
  parameters: getOrganizationSchema,
  async execute(params: GetOrganizationParams): Promise<OrganizationResponse> {
    return huliClient.getOrganization(params.expand);
  },
};
export type GetOrganizationTool = typeof getOrganization;

