import { FastifyInstance } from 'fastify';
import {
  scheduleAppointment,
  ScheduleAppointmentParams,
} from '../tools/scheduleAppointment';
import {
  cancelAppointment,
  CancelAppointmentParams,
} from '../tools/cancelAppointment';
import { rescheduleAppointment, RescheduleAppointmentParams } from '../tools/rescheduleAppointment';
import { getAvailability, GetAvailabilityParams } from '../tools/getAvailability';
import { getAppointments, GetAppointmentsParams } from '../tools/getAppointments';
import { getAppointmentById, GetAppointmentByIdParams } from '../tools/getAppointmentById';
import { updateAppointment, UpdateAppointmentParams } from '../tools/updateAppointment';
import { confirmAppointment, ConfirmAppointmentParams } from '../tools/confirmAppointment';
import { markNoShow, MarkNoShowParams } from '../tools/markNoShow';
import { getMostUsedAppointmentColors, GetMostUsedAppointmentColorsParams } from '../tools/getMostUsedAppointmentColors';
import { listAppointmentTags, ListAppointmentTagsParams } from '../tools/listAppointmentTags';
import { getOrganization, GetOrganizationParams } from '../tools/getOrganization';
import { getDoctor, GetDoctorParams } from '../tools/getDoctor';
import { getDoctorByUser, GetDoctorByUserParams } from '../tools/getDoctorByUser';
import { getDoctorClinicPhone, GetDoctorClinicPhoneParams } from '../tools/getDoctorClinicPhone';
import { getDoctorClinicAddress, GetDoctorClinicAddressParams } from '../tools/getDoctorClinicAddress';
import { getPatient, GetPatientParams } from '../tools/getPatient';
import { getPatientByExternalId, GetPatientByExternalIdParams } from '../tools/getPatientByExternalId';
import { createPatientFile, CreatePatientFileParams } from '../tools/createPatientFile';
import { listPatientFiles, ListPatientFilesParams } from '../tools/listPatientFiles';
import { getPatientFile, GetPatientFileParams } from '../tools/getPatientFile';
import { uploadPatientDocument, UploadPatientDocumentParams } from '../tools/uploadPatientDocument';
import { getClinics, GetClinicsParams } from '../tools/getClinics';
import { getClinic, GetClinicParams } from '../tools/getClinic';
import { Appointment } from './schema';
import { z } from 'zod';

export interface Tool<P, R> {
  name: string;
  description: string;
  parameters: z.ZodType<P>;
  execute: (params: P) => Promise<R>;
}

export const tools: Tool<any, any>[] = [
  scheduleAppointment,
  cancelAppointment,
  rescheduleAppointment,
  getAvailability,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  confirmAppointment,
  markNoShow,
  getMostUsedAppointmentColors,
  listAppointmentTags,
  getOrganization,
  getDoctor,
  getDoctorByUser,
  getDoctorClinicPhone,
  getDoctorClinicAddress,
  getPatient,
  getPatientByExternalId,
  createPatientFile,
  listPatientFiles,
  getPatientFile,
  uploadPatientDocument,
  getClinics,
  getClinic,
];

export function registerToolRoutes(app: FastifyInstance): void {
  app.get('/mcp/tools', async () =>
    tools.map((t) => ({
      name: t.name,
      description: t.description,
      schema: (t.parameters as any).toJSON?.() ?? {},
    }))
  );

  app.post<{ Params: { tool: string }; Body: unknown }>('/mcp/tool/execute/:tool', async (req, reply) => {
    const tool = tools.find((t) => t.name === req.params.tool);
    if (!tool) return reply.status(404).send({ error: 'Tool not found' });
    const parsed = tool.parameters.safeParse(req.body);
    if (!parsed.success) return reply.status(400).send(parsed.error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await tool.execute(parsed.data as any);
    return result;
  });
}
