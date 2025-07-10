import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { CreateAppointmentRequest, Appointment } from '../mcp/schema';
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
}

export const huliClient = new HuliClient();
