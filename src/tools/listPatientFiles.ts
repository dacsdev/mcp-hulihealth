import { z } from 'zod';
import { huliClient } from '../services/huliClient';
import { PatientFileList } from '../mcp/schema';

export const listPatientFilesSchema = z.object({
  query: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
});

export type ListPatientFilesParams = z.infer<typeof listPatientFilesSchema>;

export const listPatientFiles = {
  name: 'list_patient_files',
  description: `Lists patient files matching a search query with pagination.`,
  parameters: listPatientFilesSchema,
  async execute(params: ListPatientFilesParams): Promise<PatientFileList> {
    return huliClient.listPatientFiles(params.query, params.limit, params.offset);
  },
};
export type ListPatientFilesTool = typeof listPatientFiles;
