export interface CreateAppointmentRequest {
  id_doctor: number;
  id_clinic: number;
  start_date: string; // YYYY-MM-DD
  time_from: string; // HH:MM:SS
  id_patient_file?: number;
  source_event?: number;
  end_date?: string;
  time_to?: string;
  notes?: string;
  color?: string;
  id_treatment?: number;
  insurance_name?: string;
  insurance_number?: string;
  is_first_time_patient?: boolean;
  id_tags?: number[];
}

export interface Appointment {
  idEvent: string;
  idDoctor: string;
  idClinic: string;
  idPatientFile?: string;
  idCalendar: string;
  idUserModifiedBy?: string;
  idUserCreatedBy?: string;
  isConfirmedByProvider?: boolean;
  isConfirmedByPatient?: boolean;
  isFirstTimePatient?: boolean;
  isStatusModifiedByPatient?: boolean;
  isDeletedForDoctor?: boolean;
  statusAppointment: string;
  statusAvailability: string;
  startDate: string;
  timeFrom: string;
  endDate: string;
  timeTo: string;
  createdOn: string;
  insuranceName?: string;
  insuranceNumber?: string;
}
