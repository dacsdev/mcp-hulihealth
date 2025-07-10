import os
import requests
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "https://api.huli.io/practice/v2"

API_KEY = os.getenv("HULIHEALTH_API_KEY")
ORG_ID = os.getenv("HULI_ORG_ID")

if not API_KEY:
    raise RuntimeError("Falta la variable de entorno HULIHEALTH_API_KEY")
if not ORG_ID:
    raise RuntimeError("Falta la variable de entorno HULI_ORG_ID")

def get_jwt():
    url = f"{BASE_URL}/authorization/token"
    payload = { "api_key": API_KEY }
    res = requests.post(url, json=payload)
    res.raise_for_status()
    data = res.json()
    # El JWT puede estar en data['data']['jwt'] según el OpenAPI
    return data['data']['jwt']

def get_headers():
    jwt = get_jwt()
    return {
        "Authorization": f"Bearer {jwt}",
        "id_organization": ORG_ID
    }

# -------------------- CITAS --------------------

def create_appointment(data: dict):
    url = f"{BASE_URL}/appointments"
    res = requests.post(url, headers=get_headers(), json=data)
    res.raise_for_status()
    return res.json()

def cancel_appointment(appointment_id: str, by_patient: bool = True):
    url = f"{BASE_URL}/appointments/cancel/{appointment_id}"
    payload = { "is_status_modified_by_patient": by_patient }
    res = requests.put(url, headers=get_headers(), json=payload)
    res.raise_for_status()
    return res.json()

def reschedule_appointment(appointment_id: str, data: dict):
    url = f"{BASE_URL}/appointments/reschedule/{appointment_id}"
    res = requests.put(url, headers=get_headers(), json=data)
    res.raise_for_status()
    return res.json()

def get_appointments(patient_file_id: str):
    url = f"{BASE_URL}/appointment/patient/{patient_file_id}"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

def get_appointments_flexible(doctor_id: str = None, patient_file_id: str = None, from_date: str = None, to_date: str = None, limit: int = 20, offset: int = 0, status_appointment: str = None, id_clinic: str = None):
    """
    Obtiene citas por doctor o por paciente, con filtros opcionales.
    - Si doctor_id: /practice/v2/appointment/doctor/{doctor_id}
    - Si patient_file_id: /practice/v2/appointment/patient/{patient_file_id}
    """
    if doctor_id:
        url = f"https://api.huli.io/practice/v2/appointment/doctor/{doctor_id}"
    elif patient_file_id:
        url = f"https://api.huli.io/practice/v2/appointment/patient/{patient_file_id}"
    else:
        raise ValueError("Se requiere doctor_id o patient_file_id")
    params = {"limit": limit, "offset": offset}
    if from_date:
        params["from"] = from_date
    if to_date:
        params["to"] = to_date
    if status_appointment:
        params["status_appointment"] = status_appointment
    if id_clinic and doctor_id:
        params["idClinic"] = id_clinic
    res = requests.get(url, headers=get_headers(), params=params)
    res.raise_for_status()
    return res.json()

def get_most_used_appointment_colors(doctor_id: str = None, clinic_id: str = None, patient_file_id: str = None, from_date: str = None, to_date: str = None, status_appointment: str = None, limit: int = 1000):
    # Construir la URL base para listar citas
    url = None
    params = {"limit": limit}
    if doctor_id:
        url = f"https://api.huli.io/practice/v2/appointment/doctor/{doctor_id}"
        if clinic_id:
            params["idClinic"] = clinic_id
    elif patient_file_id:
        url = f"https://api.huli.io/practice/v2/appointment/patient/{patient_file_id}"
    else:
        raise ValueError("You must provide at least doctor_id or patient_file_id")
    if from_date:
        params["from"] = from_date
    if to_date:
        params["to"] = to_date
    if status_appointment:
        params["status_appointment"] = status_appointment
    res = requests.get(url, headers=get_headers(), params=params)
    res.raise_for_status()
    data = res.json()
    # Extraer colores
    appointments = data.get("appointments", [])
    color_info = {}
    for appt in appointments:
        color = appt.get("color")
        appt_type = appt.get("type") or appt.get("appointmentType") or appt.get("statusAppointment")
        if color:
            if color not in color_info:
                color_info[color] = {"count": 0, "types": set()}
            color_info[color]["count"] += 1
            if appt_type:
                color_info[color]["types"].add(appt_type)
    # Formatear resultado
    color_ranking = [
        {"color": color, "count": info["count"], "types": list(info["types"])}
        for color, info in sorted(color_info.items(), key=lambda x: x[1]["count"], reverse=True)
    ]
    return {"color_ranking": color_ranking, "total_appointments": len(appointments)}

# -------------------- DISPONIBILIDAD --------------------

def get_availability(doctor_id: str, clinic_id: str, from_date: str = None, to_date: str = None):
    url = f"{BASE_URL}/availability/doctor/{doctor_id}/clinic/{clinic_id}"
    params = {}
    if from_date:
        params["from"] = from_date
    if to_date:
        params["to"] = to_date
    res = requests.get(url, headers=get_headers(), params=params)
    res.raise_for_status()
    return res.json()

def get_available_doctors(clinic_id: str):
    url = f"{BASE_URL}/doctor/availability/clinic/{clinic_id}"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

# -------------------- DOCTORES --------------------

def get_doctor(doctor_id: str):
    url = f"{BASE_URL}/doctor/{doctor_id}"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

# -------------------- PACIENTES --------------------

def get_patient(patient_file_id: str):
    url = f"{BASE_URL}/patient/{patient_file_id}"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

def get_patient_by_external_id(external_id: str):
    url = f"{BASE_URL}/patient/external-id/{external_id}"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

def get_medical_record(patient_id: str, owner_id: str):
    url = f"https://api.huli.io/practice/v1/ehr/patient/{patient_id}/owner/{owner_id}/medical-record"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

# -------------------- CLÍNICAS --------------------

def get_clinics():
    url = f"{BASE_URL}/clinic"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

def get_clinic(clinic_id: str):
    url = f"{BASE_URL}/clinic/{clinic_id}"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

# -------------------- AUTENTICACIÓN --------------------

def get_token(api_key: str = None):
    url = f"{BASE_URL}/authorization/token"
    payload = { "api_key": api_key or API_KEY }
    res = requests.post(url, json=payload)
    res.raise_for_status()
    return res.json()

def get_checkup(event_id: str):
    url = f"https://api.huli.io/practice/v2/checkup/{event_id}"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

def get_checkup_note(event_id: str):
    url = f"https://api.huli.io/practice/v2/checkup/{event_id}/note"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

def get_checkup_diagnosis(event_id: str):
    url = f"https://api.huli.io/practice/v2/checkup/{event_id}/diagnosis"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

def get_checkup_prescription(event_id: str):
    url = f"https://api.huli.io/practice/v2/checkup/{event_id}/prescription"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

def get_checkup_vital_signs(event_id: str):
    url = f"https://api.huli.io/practice/v2/checkup/{event_id}/vital-signs"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

def get_checkup_lab_procedure_request(event_id: str):
    url = f"https://api.huli.io/practice/v2/checkup/{event_id}/lab-procedure-request"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

def get_checkup_suffering(event_id: str):
    url = f"https://api.huli.io/practice/v2/checkup/{event_id}/suffering"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

def get_checkup_reason_of_visit(event_id: str):
    url = f"https://api.huli.io/practice/v2/checkup/{event_id}/reason-of-visit"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

def get_checkup_physical_note(event_id: str):
    url = f"https://api.huli.io/practice/v2/checkup/{event_id}/physical-note"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

def create_patient_file(data: dict):
    url = f"https://api.huli.io/practice/v2/patient-file"
    res = requests.post(url, headers=get_headers(), json=data)
    res.raise_for_status()
    return res.json()

def list_patient_files(query: str = None, limit: int = 20, offset: int = 0):
    url = f"https://api.huli.io/practice/v2/patient-file"
    params = {"limit": limit, "offset": offset}
    if query:
        params["query"] = query
    res = requests.get(url, headers=get_headers(), params=params)
    res.raise_for_status()
    return res.json()

def get_patient_file(patient_file_id: str):
    url = f"https://api.huli.io/practice/v2/patient-file/{patient_file_id}"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

def upload_patient_document(patient_file_id: str, owner_id: str, data: dict):
    url = f"https://api.huli.io/practice/v2/ehr/patient/{patient_file_id}/owner/{owner_id}/document"
    res = requests.post(url, headers=get_headers(), json=data)
    res.raise_for_status()
    return res.json()


def list_appointment_tags(limit: int = 10, offset: int = 0):
    url = f"https://api.huli.io/practice/v2/appointment/tags"
    params = {"limit": limit, "offset": offset}
    res = requests.get(url, headers=get_headers(), params=params)
    res.raise_for_status()
    return res.json()

def get_checkup_anthropometric_data(event_id: str):
    url = f"https://api.huli.io/practice/v2/checkup/{event_id}/anthropometric-data"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

def get_checkup_review_of_systems(event_id: str):
    url = f"https://api.huli.io/practice/v2/checkup/{event_id}/review-of-systems"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

def get_checkup_systematic_examination(event_id: str):
    url = f"https://api.huli.io/practice/v2/checkup/{event_id}/systematic-examination"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

def get_checkup_sleep_pattern(event_id: str):
    url = f"https://api.huli.io/practice/v2/checkup/{event_id}/sleep-pattern"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

def get_checkup_bowel_habit(event_id: str):
    url = f"https://api.huli.io/practice/v2/checkup/{event_id}/bowel-habit"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

def get_checkup_plan_note(event_id: str):
    url = f"https://api.huli.io/practice/v2/checkup/{event_id}/plan-note"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

def get_checkup_custom_questions(event_id: str):
    url = f"https://api.huli.io/practice/v2/checkup/{event_id}/questions"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

def get_checkup_last_menstrual_cycle(event_id: str):
    url = f"https://api.huli.io/practice/v2/checkup/{event_id}/last-menstrual-cycle"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

# -------------------- EXTRA APPOINTMENT ENDPOINTS --------------------

def get_appointment_by_id(event_id: str):
    url = f"{BASE_URL}/appointment/{event_id}"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

def update_appointment(event_id: str, data: dict):
    url = f"{BASE_URL}/appointment/{event_id}"
    res = requests.put(url, headers=get_headers(), json=data)
    res.raise_for_status()
    return res.json()

def confirm_appointment(event_id: str):
    url = f"{BASE_URL}/appointment/{event_id}/patient-confirm"
    res = requests.post(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

def mark_no_show(event_id: str):
    url = f"{BASE_URL}/appointment/{event_id}/no-show"
    res = requests.post(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

# -------------------- EXTRA DOCTOR ENDPOINTS --------------------

def get_doctor_by_user(user_id: str):
    url = f"{BASE_URL}/doctor/user/{user_id}"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

def get_doctor_clinic_phone(doctor_id: str, clinic_id: str):
    url = f"{BASE_URL}/doctor/{doctor_id}/clinic/{clinic_id}/phone"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

def get_doctor_clinic_address(doctor_id: str, clinic_id: str):
    url = f"{BASE_URL}/doctor/{doctor_id}/clinic/{clinic_id}/address"
    res = requests.get(url, headers=get_headers())
    res.raise_for_status()
    return res.json()

# -------------------- ORGANIZATION --------------------

def get_organization(expand: str = None):
    url = f"https://api.huli.io/practice/v2/organization"
    params = {}
    if expand:
        params["expand"] = expand
    res = requests.get(url, headers=get_headers(), params=params)
    res.raise_for_status()
    return res.json()