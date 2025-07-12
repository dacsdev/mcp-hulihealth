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
import { getMedicalRecord, GetMedicalRecordParams } from '../tools/getMedicalRecord';
import { getCheckup, GetCheckupParams } from '../tools/getCheckup';
import { getCheckupNote, GetCheckupNoteParams } from '../tools/getCheckupNote';
import { getCheckupDiagnosis, GetCheckupDiagnosisParams } from '../tools/getCheckupDiagnosis';
import { getCheckupPrescription, GetCheckupPrescriptionParams } from '../tools/getCheckupPrescription';
import { getCheckupVitalSigns, GetCheckupVitalSignsParams } from '../tools/getCheckupVitalSigns';
import { getCheckupLabProcedureRequest, GetCheckupLabProcedureRequestParams } from '../tools/getCheckupLabProcedureRequest';
import { getCheckupSuffering, GetCheckupSufferingParams } from '../tools/getCheckupSuffering';
import { getCheckupReasonOfVisit, GetCheckupReasonOfVisitParams } from '../tools/getCheckupReasonOfVisit';
import { getCheckupPhysicalNote, GetCheckupPhysicalNoteParams } from '../tools/getCheckupPhysicalNote';
import { getCheckupAnthropometricData, GetCheckupAnthropometricDataParams } from '../tools/getCheckupAnthropometricData';
import { getCheckupReviewOfSystems, GetCheckupReviewOfSystemsParams } from '../tools/getCheckupReviewOfSystems';
import { getCheckupSystematicExamination, GetCheckupSystematicExaminationParams } from '../tools/getCheckupSystematicExamination';
import { getCheckupSleepPattern, GetCheckupSleepPatternParams } from '../tools/getCheckupSleepPattern';
import { getCheckupBowelHabit, GetCheckupBowelHabitParams } from '../tools/getCheckupBowelHabit';
import { getCheckupPlanNote, GetCheckupPlanNoteParams } from '../tools/getCheckupPlanNote';
import { getCheckupCustomQuestions, GetCheckupCustomQuestionsParams } from '../tools/getCheckupCustomQuestions';
import { getCheckupLastMenstrualCycle, GetCheckupLastMenstrualCycleParams } from '../tools/getCheckupLastMenstrualCycle';
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
  getMedicalRecord,
  getCheckup,
  getCheckupNote,
  getCheckupDiagnosis,
  getCheckupPrescription,
  getCheckupVitalSigns,
  getCheckupLabProcedureRequest,
  getCheckupSuffering,
  getCheckupReasonOfVisit,
  getCheckupPhysicalNote,
  getCheckupAnthropometricData,
  getCheckupReviewOfSystems,
  getCheckupSystematicExamination,
  getCheckupSleepPattern,
  getCheckupBowelHabit,
  getCheckupPlanNote,
  getCheckupCustomQuestions,
  getCheckupLastMenstrualCycle,
];
