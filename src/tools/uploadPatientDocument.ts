import { z } from 'zod';
import { huliClient } from '../services/huliClient';
import { UploadDocumentRequest } from '../mcp/schema';

export const uploadPatientDocumentSchema = z.object({
  patient_file_id: z.string(),
  owner_id: z.string(),
  data: z.any(),
});

export type UploadPatientDocumentParams = z.infer<typeof uploadPatientDocumentSchema>;

export const uploadPatientDocument = {
  name: 'upload_patient_document',
  description: `Uploads a document to a patient's file.`,
  parameters: uploadPatientDocumentSchema,
  async execute(params: UploadPatientDocumentParams): Promise<Record<string, unknown>> {
    const data: UploadDocumentRequest = params.data;
    return huliClient.uploadPatientDocument(params.patient_file_id, params.owner_id, data);
  },
};
export type UploadPatientDocumentTool = typeof uploadPatientDocument;
