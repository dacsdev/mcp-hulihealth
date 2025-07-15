/**
 * Minimal wrapper around the HuliHealth HTTP API.
 * Handles authentication and provides typed methods for all endpoints.
 */
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  CreateAppointmentRequest,
  Appointment,
  CancelAppointmentRequest,
  RescheduleAppointmentRequest,
  UpdateAppointmentRequest,
  DoctorAvailabilityResponse,
  AppointmentList,
  AppointmentTagsResponse,
  OrganizationResponse,
  Doctor,
  DoctorClinicPhone,
  DoctorClinicAddress,
  Patient,
  PatientFileRequest,
  PatientFileResponse,
  PatientFileList,
  UploadDocumentRequest,
  Clinic,
  ClinicList,
  MedicalRecord,
  Checkup,
  CheckupNote,
  CheckupDiagnosis,
  CheckupPrescription,
  CheckupVitalSigns,
  CheckupLabProcedure,
  CheckupSuffering,
  CheckupReasonOfVisit,
  CheckupPhysicalNote,
  CheckupAnthropometric,
  CheckupReviewOfSystems,
  CheckupSystematicExamination,
  CheckupSleepPattern,
  CheckupBowelHabit,
  CheckupPlanNote,
  CheckupCustomQuestions,
  CheckupLastMenstrualCycle,
} from '../mcp/schema.js';
import * as dotenv from "dotenv";

dotenv.config();

const BASE_URL = 'https://api.huli.io/practice/v2';

class HuliClient {
  private token?: string;
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({ baseURL: BASE_URL });
  }

  private async authenticate(): Promise<void> {
    const apiKey = process.env.HULIHEALTH_API_KEY;
    if (!apiKey) throw new Error('HULIHEALTH_API_KEY is not set');
    const res = await axios.post<{ data: { jwt: string } }>(`${BASE_URL}/authorization/token`, { api_key: apiKey });
    this.token = res.data.data.jwt;
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    if (!this.token) await this.authenticate();
    const headers = {
      Authorization: `Bearer ${this.token}`,
      ...config.headers,
    };
  /**
   * Makes an authenticated request to the HuliHealth API.
   * Automatically refreshes the JWT if needed.
   */
    try {
      const res = await this.client.request<T>({ ...config, headers });
      // Axios returns data property
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (res as any).data;
    } catch (err: any) {
      if (err.response && [401, 403].includes(err.response.status)) {
        await this.authenticate();
        const retryHeaders = {
          Authorization: `Bearer ${this.token}`,
          id_organization: process.env.HULI_ORG_ID,
          ...config.headers,
        };
        const res = await this.client.request<T>({ ...config, headers: retryHeaders });
        return (res as any).data;
      }
      throw err;
    }
  }

  async createAppointment(data: CreateAppointmentRequest): Promise<Appointment> {
    return this.request<Appointment>({ method: 'POST', url: '/appointment', data });
  }

  async cancelAppointment(eventId: string, data: CancelAppointmentRequest): Promise<Appointment> {
    return this.request<Appointment>({ method: 'PUT', url: `/appointment/${eventId}/cancel`, data });
  }

  async rescheduleAppointment(eventId: string, data: RescheduleAppointmentRequest): Promise<Appointment> {
    return this.request<Appointment>({ method: 'PUT', url: `/appointment/${eventId}/reschedule`, data });
  }

  async getAvailability(
    doctorId: string,
    clinicId: string,
    from: string,
    to: string
  ): Promise<DoctorAvailabilityResponse> {
    return this.request<DoctorAvailabilityResponse>({
      method: 'GET',
      url: `/availability/doctor/${doctorId}/clinic/${clinicId}`,
      params: { from, to },
    });
  }

  async getAppointmentsByDoctor(
    doctorId: string,
    options: {
      from?: string;
      to?: string;
      limit?: number;
      offset?: number;
      status_appointment?: string;
      idClinic?: string;
    } = {}
  ): Promise<AppointmentList> {
    return this.request<AppointmentList>({
      method: 'GET',
      url: `/appointment/doctor/${doctorId}`,
      params: options,
    });
  }

  async getAppointmentsByPatient(
    patientFileId: string,
    options: {
      from?: string;
      to?: string;
      limit?: number;
      offset?: number;
      status_appointment?: string;
    } = {}
  ): Promise<AppointmentList> {
    return this.request<AppointmentList>({
      method: 'GET',
      url: `/appointment/patient/${patientFileId}`,
      params: options,
    });
  }

  async getAppointmentById(eventId: string): Promise<Appointment> {
    return this.request<Appointment>({ method: 'GET', url: `/appointment/${eventId}` });
  }

  async updateAppointment(eventId: string, data: UpdateAppointmentRequest): Promise<Appointment> {
    return this.request<Appointment>({ method: 'PUT', url: `/appointment/${eventId}`, data });
  }

  async confirmAppointment(eventId: string): Promise<Appointment> {
    return this.request<Appointment>({ method: 'PUT', url: `/appointment/${eventId}/patient-confirm` });
  }

  async markNoShow(eventId: string): Promise<Appointment> {
    return this.request<Appointment>({ method: 'PUT', url: `/appointment/${eventId}/no-show` });
  }

  async listAppointmentTags(limit = 10, offset = 0): Promise<AppointmentTagsResponse> {
    return this.request<AppointmentTagsResponse>({
      method: 'GET',
      url: '/appointment/tags',
      params: { limit, offset },
    });
  }

  async listPatientFiles(query?: string, limit = 20, offset = 0): Promise<PatientFileList> {
    const params: Record<string, any> = { limit, offset };
    if (query) params.query = query;
    return this.request<PatientFileList>({ method: 'GET', url: '/patient-file', params });
  }

  async getOrganization(expand?: string): Promise<OrganizationResponse> {
    return this.request<OrganizationResponse>({
      method: 'GET',
      url: '/organization',
      params: expand ? { expand } : {},
    });
  }

  async getDoctorById(idDoctor: string): Promise<Doctor> {
    return this.request<Doctor>({ method: 'GET', url: `/doctor/${idDoctor}` });
  }

  async getDoctorByUser(idUser: string): Promise<Doctor> {
    return this.request<Doctor>({ method: 'GET', url: `/doctor/user/${idUser}` });
  }

  async getDoctorClinicPhone(doctorId: string, clinicId: string): Promise<DoctorClinicPhone> {
    return this.request<DoctorClinicPhone>({
      method: 'GET',
      url: `/doctor/${doctorId}/clinic/${clinicId}/phone`,
    });
  }

  async getDoctorClinicAddress(doctorId: string, clinicId: string): Promise<DoctorClinicAddress> {
    return this.request<DoctorClinicAddress>({
      method: 'GET',
      url: `/doctor/${doctorId}/clinic/${clinicId}/address`,
    });
  }

  async getPatient(patientFileId: string): Promise<Patient> {
    return this.request<Patient>({ method: 'GET', url: `/patient/${patientFileId}` });
  }

  async getPatientByExternalId(externalId: string): Promise<Patient> {
    return this.request<Patient>({ method: 'GET', url: `/patient/external-id/${externalId}` });
  }

  async createPatientFile(data: PatientFileRequest): Promise<PatientFileResponse> {
    return this.request<PatientFileResponse>({ method: 'POST', url: '/patient-file', data });
  }

  async getPatientFile(patientFileId: string): Promise<PatientFileResponse> {
    return this.request<PatientFileResponse>({ method: 'GET', url: `/patient-file/${patientFileId}` });
  }

  async uploadPatientDocument(
    patientFileId: string,
    ownerId: string,
    data: UploadDocumentRequest
  ): Promise<Record<string, unknown>> {
    return this.request({
      method: 'POST',
      url: `/ehr/patient/${patientFileId}/owner/${ownerId}/document`,
      data,
    });
  }

  async getClinics(): Promise<ClinicList> {
    return this.request<ClinicList>({ method: 'GET', url: '/clinic' });
  }

  async getClinic(clinicId: string): Promise<Clinic> {
    return this.request<Clinic>({ method: 'GET', url: `/clinic/${clinicId}` });
  }

  async getMedicalRecord(patientId: string, ownerId: string): Promise<MedicalRecord> {
    return this.request<MedicalRecord>({
      method: 'GET',
      url: `https://api.huli.io/practice/v1/ehr/patient/${patientId}/owner/${ownerId}/medical-record`,
    });
  }

  async getCheckup(eventId: string): Promise<Checkup> {
    return this.request<Checkup>({ method: 'GET', url: `/checkup/${eventId}` });
  }

  async getCheckupNote(eventId: string): Promise<CheckupNote> {
    return this.request<CheckupNote>({ method: 'GET', url: `/checkup/${eventId}/note` });
  }

  async getCheckupDiagnosis(eventId: string): Promise<CheckupDiagnosis> {
    return this.request<CheckupDiagnosis>({ method: 'GET', url: `/checkup/${eventId}/diagnosis` });
  }

  async getCheckupPrescription(eventId: string): Promise<CheckupPrescription> {
    return this.request<CheckupPrescription>({ method: 'GET', url: `/checkup/${eventId}/prescription` });
  }

  async getCheckupVitalSigns(eventId: string): Promise<CheckupVitalSigns> {
    return this.request<CheckupVitalSigns>({ method: 'GET', url: `/checkup/${eventId}/vital-signs` });
  }

  async getCheckupLabProcedureRequest(eventId: string): Promise<CheckupLabProcedure> {
    return this.request<CheckupLabProcedure>({ method: 'GET', url: `/checkup/${eventId}/lab-procedure-request` });
  }

  async getCheckupSuffering(eventId: string): Promise<CheckupSuffering> {
    return this.request<CheckupSuffering>({ method: 'GET', url: `/checkup/${eventId}/suffering` });
  }

  async getCheckupReasonOfVisit(eventId: string): Promise<CheckupReasonOfVisit> {
    return this.request<CheckupReasonOfVisit>({ method: 'GET', url: `/checkup/${eventId}/reason-of-visit` });
  }

  async getCheckupPhysicalNote(eventId: string): Promise<CheckupPhysicalNote> {
    return this.request<CheckupPhysicalNote>({ method: 'GET', url: `/checkup/${eventId}/physical-note` });
  }

  async getCheckupAnthropometricData(eventId: string): Promise<CheckupAnthropometric> {
    return this.request<CheckupAnthropometric>({ method: 'GET', url: `/checkup/${eventId}/anthropometric-data` });
  }

  async getCheckupReviewOfSystems(eventId: string): Promise<CheckupReviewOfSystems> {
    return this.request<CheckupReviewOfSystems>({ method: 'GET', url: `/checkup/${eventId}/review-of-systems` });
  }

  async getCheckupSystematicExamination(eventId: string): Promise<CheckupSystematicExamination> {
    return this.request<CheckupSystematicExamination>({ method: 'GET', url: `/checkup/${eventId}/systematic-examination` });
  }

  async getCheckupSleepPattern(eventId: string): Promise<CheckupSleepPattern> {
    return this.request<CheckupSleepPattern>({ method: 'GET', url: `/checkup/${eventId}/sleep-pattern` });
  }

  async getCheckupBowelHabit(eventId: string): Promise<CheckupBowelHabit> {
    return this.request<CheckupBowelHabit>({ method: 'GET', url: `/checkup/${eventId}/bowel-habit` });
  }

  async getCheckupPlanNote(eventId: string): Promise<CheckupPlanNote> {
    return this.request<CheckupPlanNote>({ method: 'GET', url: `/checkup/${eventId}/plan-note` });
  }

  async getCheckupCustomQuestions(eventId: string): Promise<CheckupCustomQuestions> {
    return this.request<CheckupCustomQuestions>({ method: 'GET', url: `/checkup/${eventId}/questions` });
  }

  async getCheckupLastMenstrualCycle(eventId: string): Promise<CheckupLastMenstrualCycle> {
    return this.request<CheckupLastMenstrualCycle>({ method: 'GET', url: `/checkup/${eventId}/last-menstrual-cycle` });
  }
}

export const huliClient = new HuliClient();
