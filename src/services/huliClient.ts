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
} from '../mcp/schema';
import dotenv from 'dotenv';

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
      id_organization: process.env.HULI_ORG_ID,
      ...config.headers,
    };
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
}

export const huliClient = new HuliClient();
