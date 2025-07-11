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

export interface CancelAppointmentRequest {
  is_status_modified_by_patient: boolean;
}
export interface RescheduleAppointmentRequest {
  isStatusModifiedByPatient: boolean;
  startDate: string;
  timeFrom: string;
  endDate?: string;
  timeTo?: string;
  sourceEvent?: string;
}

export interface UpdateAppointmentRequest {
  notes?: string;
  color?: string;
  id_treatment?: number;
  insurance_name?: string;
  insurance_number?: string;
  is_first_time_patient?: boolean;
  is_deleted_for_doctor?: boolean;
  id_tags?: number[];
}

export interface DoctorAvailabilityResponse {
  idCalendar: string;
  idClinic: string;
  idDoctor: string;
  slotDates: {
    date: string;
    dateL10n: string;
    dateL10nComp: string;
    slots: {
      dateTime: string;
      sourceEvent: string;
      time: string;
      timeL10n: string;
    }[];
  }[];
}

export interface AppointmentList {
  appointments: Appointment[];
  total: string;
  size: string;
}

export interface BookingTag {
  idTag: string;
  idOrganization: string;
  color: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface AppointmentTagsResponse {
  tags: BookingTag[];
  total: string;
  size: string;
}

export interface Authorization {
  id: string;
  idGrantor: string;
  idGrantee: string;
  idOrganization: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Organization {
  idOrganization: string;
  idOwner: string;
  name: string;
  idUserModifiedBy?: string;
  status: 'ACTIVE' | 'INACTIVE';
  authorization?: Authorization[] | null;
}

export interface OrganizationResponse {
  organizations: Organization[];
}

export interface Doctor {
  id: string;
  photo?: string;
  url?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  idUser: string;
}

export interface DoctorClinicPhone {
  idDoctor: string;
  idClinic: string;
  phone: string[];
}

export interface DoctorClinicAddress {
  idDoctor: string;
  idClinic: string;
  address: string;
}

export interface Patient {
  id: string;
  status?: string;
  personalData?: {
    firstName?: string;
    lastName?: string;
    knownAs?: string;
    photo?: string;
  };
  contact?: {
    email?: string;
  };
}

export interface PatientFileRequest {
  personalData: {
    firstName: string;
    lastName?: string;
    knownAs?: string;
  };
}

export interface PatientFile extends Patient {
  idUser?: string;
  idPatient?: string;
}

export interface PatientFileResponse extends PatientFile {}

export interface PatientFileList {
  patientFiles: PatientFile[];
  total: number;
  size: number;
}

export interface UploadDocumentRequest {
  file: string;
  filename: string;
}
export interface Country {
  id: string;
  iso2?: string;
  iso3?: string;
  name?: string;
  phonePrefix?: string;
}

export interface Province {
  id: string;
  name?: string;
  country?: Country;
  timeZone?: string;
}

export interface City {
  id: string;
  name?: string;
  province?: Province;
}

export interface User {
  id: string;
  email?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  gender?: 'MALE' | 'FEMALE';
  phoneNumber?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'DELETED';
}

export interface Clinic {
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  phoneNumber?: string;
  email?: string;
  url?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  idCity?: string;
  city?: City;
  idUser?: string;
  user?: User;
  type?: 'PHYSICAL' | 'VIRTUAL';
  cityName?: string;
}

export interface ClinicList {
  clinics: Clinic[];
}