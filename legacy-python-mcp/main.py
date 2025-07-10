from fastapi import FastAPI, HTTPException, Request
from typing import Any
from hulihealth_mcp.mcp_types import SchemaResponse, ObjectResponse, ToolsResponse, Tool, ToolParameter
from hulihealth_mcp.utils import build_mcp_schema, build_objects_response, validate_required_params, validate_and_format_date, validate_id
import os
from hulihealth_mcp.huli_api import (
    get_availability,
    create_appointment,
    cancel_appointment,
    reschedule_appointment,
    get_available_doctors,
    get_doctor,
    get_patient,
    get_patient_by_external_id,
    get_appointments,
    get_clinics,
    get_clinic,
    get_token,
    get_checkup,
    get_checkup_note,
    get_checkup_diagnosis,
    get_checkup_prescription,
    get_checkup_vital_signs,
    get_checkup_lab_procedure_request,
    get_checkup_suffering,
    get_checkup_reason_of_visit,
    get_checkup_physical_note,
    get_checkup_anthropometric_data,
    get_checkup_review_of_systems,
    get_checkup_systematic_examination,
    get_checkup_sleep_pattern,
    get_checkup_bowel_habit,
    get_checkup_plan_note,
    get_checkup_custom_questions,
    get_checkup_last_menstrual_cycle,
    create_patient_file,
    list_patient_files,
    get_patient_file,
    upload_patient_document,
    get_organization,
    get_appointment_by_id,
    update_appointment,
    confirm_appointment,
    mark_no_show,
    get_doctor_by_user,
    get_doctor_clinic_phone,
    get_doctor_clinic_address,
    list_appointment_tags,
    get_most_used_appointment_colors,
    get_appointments_flexible,
    get_medical_record,
)
import requests
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Endpoint: MCP Schema
@app.get("/mcp/schema", response_model=SchemaResponse)
def schema():
    return build_mcp_schema()

# Endpoint: MCP Objects
@app.get("/mcp/objects", response_model=ObjectResponse)
def objects(doctor_id: str, clinic_id: str):
    return build_objects_response(doctor_id, clinic_id)

# Endpoint: MCP Tools (funciones disponibles para el modelo)
@app.get("/mcp/tools", response_model=ToolsResponse)
def tools():
    return ToolsResponse(
        tools=[
            Tool(
                name="agendar_cita",
                description="Crea una nueva cita médica en Huli.",
                parameters={
                    "doctor_id": ToolParameter(type="string", description="ID del doctor"),
                    "clinic_id": ToolParameter(type="string", description="ID de la clínica"),
                    "patient_file_id": ToolParameter(type="string", description="ID del expediente del paciente"),
                    "source_event": ToolParameter(type="string", description="ID del slot disponible"),
                    "notes": ToolParameter(type="string", description="Notas opcionales"),
                    "color": ToolParameter(type="string", description="Color hexadecimal para la cita (ej: FF5733)")
                }
            ),
            Tool(
                name="cancelar_cita",
                description="Cancela una cita existente en Huli.",
                parameters={
                    "event_id": ToolParameter(type="string", description="ID del evento/cita"),
                    "is_status_modified_by_patient": ToolParameter(type="boolean", description="Si el cambio lo realizó el paciente")
                }
            ),
            Tool(
                name="reagendar_cita",
                description="Reagenda una cita existente a un nuevo horario.",
                parameters={
                    "event_id": ToolParameter(type="string", description="ID del evento original"),
                    "source_event": ToolParameter(type="string", description="Nuevo slot disponible"),
                    "start_date": ToolParameter(type="string", description="Nueva fecha inicio en formato ISO"),
                    "time_from": ToolParameter(type="string", description="Hora de inicio"),
                    "time_to": ToolParameter(type="string", description="Hora de fin")
                }
            ),
            Tool(
                name="consultar_disponibilidad",
                description="Devuelve los slots disponibles para un doctor en una clínica.",
                parameters={
                    "doctor_id": ToolParameter(type="string", description="ID del doctor"),
                    "clinic_id": ToolParameter(type="string", description="ID de la clínica")
                }
            ),
            Tool(
                name="obtener_doctores",
                description="Devuelve la lista de doctores con disponibilidad en una clínica.",
                parameters={
                    "clinic_id": ToolParameter(type="string", description="ID de la clínica")
                }
            ),
            Tool(
                name="obtener_doctor",
                description="Devuelve la información de un doctor.",
                parameters={
                    "doctor_id": ToolParameter(type="string", description="ID del doctor")
                }
            ),
            Tool(
                name="obtener_paciente",
                description="Devuelve la información de un paciente por su ID de expediente.",
                parameters={
                    "patient_file_id": ToolParameter(type="string", description="ID del expediente del paciente")
                }
            ),
            Tool(
                name="buscar_paciente_externo",
                description="Busca un paciente por su ID externo.",
                parameters={
                    "external_id": ToolParameter(type="string", description="ID externo del paciente")
                }
            ),
            Tool(
                name="obtener_citas",
                description="Devuelve las citas activas de un paciente.",
                parameters={
                    "patient_file_id": ToolParameter(type="string", description="ID del expediente del paciente")
                }
            ),
            Tool(
                name="obtener_clinicas",
                description="Devuelve la lista de clínicas disponibles para la organización.",
                parameters={}
            ),
            Tool(
                name="obtener_clinica",
                description="Devuelve la información de una clínica.",
                parameters={
                    "clinic_id": ToolParameter(type="string", description="ID de la clínica")
                }
            ),
            Tool(
                name="obtener_token",
                description="Obtiene un nuevo JWT desde la API Key.",
                parameters={
                    "api_key": ToolParameter(type="string", description="API Key provista por Huli")
                }
            ),
            Tool(
                name="get_medical_record",
                description="Get the full medical record for a patient.",
                parameters={
                    "patient_id": ToolParameter(type="string", description="Patient ID"),
                    "owner_id": ToolParameter(type="string", description="Owner (doctor) user ID")
                }
            ),
            Tool(
                name="get_checkup",
                description="Get a checkup by event ID.",
                parameters={
                    "event_id": ToolParameter(type="string", description="Event (checkup) ID")
                }
            ),
            Tool(
                name="get_checkup_note",
                description="Get checkup notes by event ID.",
                parameters={
                    "event_id": ToolParameter(type="string", description="Event (checkup) ID")
                }
            ),
            Tool(
                name="get_checkup_diagnosis",
                description="Get checkup diagnosis by event ID.",
                parameters={
                    "event_id": ToolParameter(type="string", description="Event (checkup) ID")
                }
            ),
            Tool(
                name="get_checkup_prescription",
                description="Get checkup prescription by event ID.",
                parameters={
                    "event_id": ToolParameter(type="string", description="Event (checkup) ID")
                }
            ),
            Tool(
                name="get_checkup_vital_signs",
                description="Get checkup vital signs by event ID.",
                parameters={
                    "event_id": ToolParameter(type="string", description="Event (checkup) ID")
                }
            ),
            Tool(
                name="get_checkup_lab_procedure_request",
                description="Get checkup lab procedure requests by event ID.",
                parameters={
                    "event_id": ToolParameter(type="string", description="Event (checkup) ID")
                }
            ),
            Tool(
                name="get_checkup_suffering",
                description="Get checkup suffering (symptoms) by event ID.",
                parameters={
                    "event_id": ToolParameter(type="string", description="Event (checkup) ID")
                }
            ),
            Tool(
                name="get_checkup_reason_of_visit",
                description="Get checkup reason of visit by event ID.",
                parameters={
                    "event_id": ToolParameter(type="string", description="Event (checkup) ID")
                }
            ),
            Tool(
                name="get_checkup_physical_note",
                description="Get checkup physical note by event ID.",
                parameters={
                    "event_id": ToolParameter(type="string", description="Event (checkup) ID")
                }
            ),
            Tool(
                name="get_checkup_anthropometric_data",
                description="Get checkup anthropometric data by event ID.",
                parameters={
                    "event_id": ToolParameter(type="string", description="Event (checkup) ID")
                }
            ),
            Tool(
                name="get_checkup_review_of_systems",
                description="Get checkup review of systems by event ID.",
                parameters={
                    "event_id": ToolParameter(type="string", description="Event (checkup) ID")
                }
            ),
            Tool(
                name="get_checkup_systematic_examination",
                description="Get checkup systematic examination by event ID.",
                parameters={
                    "event_id": ToolParameter(type="string", description="Event (checkup) ID")
                }
            ),
            Tool(
                name="get_checkup_sleep_pattern",
                description="Get checkup sleep pattern by event ID.",
                parameters={
                    "event_id": ToolParameter(type="string", description="Event (checkup) ID")
                }
            ),
            Tool(
                name="get_checkup_bowel_habit",
                description="Get checkup bowel habit by event ID.",
                parameters={
                    "event_id": ToolParameter(type="string", description="Event (checkup) ID")
                }
            ),
            Tool(
                name="get_checkup_plan_note",
                description="Get checkup plan note by event ID.",
                parameters={
                    "event_id": ToolParameter(type="string", description="Event (checkup) ID")
                }
            ),
            Tool(
                name="get_checkup_custom_questions",
                description="Get checkup custom questions by event ID.",
                parameters={
                    "event_id": ToolParameter(type="string", description="Event (checkup) ID")
                }
            ),
            Tool(
                name="get_checkup_last_menstrual_cycle",
                description="Get checkup last menstrual cycle by event ID.",
                parameters={
                    "event_id": ToolParameter(type="string", description="Event (checkup) ID")
                }
            ),
            Tool(
                name="create_patient_file",
                description="Create a new patient file.",
                parameters={
                    "data": ToolParameter(type="object", description="Patient file data (see OpenAPI schema)")
                }
            ),
            Tool(
                name="list_patient_files",
                description="List patient files with optional query and pagination.",
                parameters={
                    "query": ToolParameter(type="string", description="Search filter (optional)",),
                    "limit": ToolParameter(type="integer", description="Max results (default 20)",),
                    "offset": ToolParameter(type="integer", description="Offset for pagination (default 0)",)
                }
            ),
            Tool(
                name="get_patient_file",
                description="Get a patient file by ID.",
                parameters={
                    "patient_file_id": ToolParameter(type="string", description="Patient file ID")
                }
            ),
            Tool(
                name="upload_patient_document",
                description="Upload a document to a patient file.",
                parameters={
                    "patient_file_id": ToolParameter(type="string", description="Patient file ID"),
                    "owner_id": ToolParameter(type="string", description="Owner (doctor) user ID"),
                    "data": ToolParameter(type="object", description="Document data (see OpenAPI schema)")
                }
            ),
            Tool(
                name="get_organization",
                description="Get organization information.",
                parameters={
                    "expand": ToolParameter(type="string", description="Optional expand query")
                }
            ),
            Tool(
                name="list_appointment_tags",
                description="List appointment tags with pagination.",
                parameters={
                    "limit": ToolParameter(type="integer", description="Max results (default 10)",),
                    "offset": ToolParameter(type="integer", description="Offset for pagination (default 0)",)
                }
            ),
            Tool(
                name="get_most_used_appointment_colors",
                description="Get a ranking of the most used appointment colors. Flexible: filter by doctor_id, clinic_id, patient_file_id, from, to, status_appointment, limit.",
                parameters={
                    "doctor_id": ToolParameter(type="string", description="Doctor ID (optional)"),
                    "clinic_id": ToolParameter(type="string", description="Clinic ID (optional)"),
                    "patient_file_id": ToolParameter(type="string", description="Patient file ID (optional)"),
                    "from": ToolParameter(type="string", description="Start date (ISO 8601, optional)"),
                    "to": ToolParameter(type="string", description="End date (ISO 8601, optional)"),
                    "status_appointment": ToolParameter(type="string", description="Appointment status (optional)"),
                    "limit": ToolParameter(type="integer", description="Max results to fetch (default 1000)")
                 }
            ),
            Tool(
                name="get_appointment_by_id",
                description="Get an appointment by its event ID.",
                parameters={
                    "event_id": ToolParameter(type="string", description="Event ID")
                }
            ),
            Tool(
                name="update_appointment",
                description="Update an appointment with new data.",
                parameters={
                    "event_id": ToolParameter(type="string", description="Event ID"),
                    "data": ToolParameter(type="object", description="Appointment payload")
                }
            ),
            Tool(
                name="confirm_appointment",
                description="Mark an appointment as confirmed by the patient.",
                parameters={
                    "event_id": ToolParameter(type="string", description="Event ID")
                }
            ),
            Tool(
                name="mark_no_show",
                description="Mark an appointment as no-show.",
                parameters={
                    "event_id": ToolParameter(type="string", description="Event ID")
                }
            ),
            Tool(
                name="get_doctor_by_user",
                description="Get doctor information using the user ID.",
                parameters={
                    "user_id": ToolParameter(type="string", description="User ID")
                }
            ),
            Tool(
                name="get_doctor_clinic_phone",
                description="Get a doctor's clinic phone number.",
                parameters={
                    "doctor_id": ToolParameter(type="string", description="Doctor ID"),
                    "clinic_id": ToolParameter(type="string", description="Clinic ID")
                }
            ),
            Tool(
                name="get_doctor_clinic_address",
                description="Get a doctor's clinic address.",
                parameters={
                    "doctor_id": ToolParameter(type="string", description="Doctor ID"),
                    "clinic_id": ToolParameter(type="string", description="Clinic ID")
                }
            )
        ]
    )

# Endpoint: MCP Tool Execution
@app.post("/mcp/tool/execute/{tool_name}")
async def execute_tool(tool_name: str, request: Request):
    data = await request.json()

    try:
        if tool_name == "agendar_cita":
            validate_required_params(data, ["doctor_id", "clinic_id", "start_date", "time_from"])
            validate_id(data["doctor_id"], "doctor_id")
            validate_id(data["clinic_id"], "clinic_id")
            data["start_date"] = validate_and_format_date(data["start_date"], "start_date")
            if data.get("end_date"):
                data["end_date"] = validate_and_format_date(data["end_date"], "end_date")
            return create_appointment(data)

        elif tool_name == "cancelar_cita":
            validate_required_params(data, ["event_id"])
            validate_id(data["event_id"], "event_id")
            return cancel_appointment(
                appointment_id=data["event_id"],
                by_patient=data.get("is_status_modified_by_patient", True)
            )

        elif tool_name == "reagendar_cita":
            email = data.get("email")
            if not email:
                raise HTTPException(status_code=400, detail="El campo 'email' es obligatorio para reagendar una cita.")
            event_id = data.get("event_id")
            validate_id(event_id, "event_id")
            if data.get("start_date"):
                data["start_date"] = validate_and_format_date(data["start_date"], "start_date")
            if data.get("end_date"):
                data["end_date"] = validate_and_format_date(data["end_date"], "end_date")
            if data.get("time_from"):
                validate_required_params(data, ["time_from"])
            if data.get("time_to"):
                validate_required_params(data, ["time_to"])

            # 2. Buscar el patient_file_id por email
            patient_search = list_patient_files(query=email, limit=1)
            patient_files = patient_search.get("patientFiles", [])
            if not patient_files:
                raise HTTPException(status_code=404, detail="No se encontró un paciente con ese correo electrónico.")
            patient_file_id = patient_files[0]["id"]

            # 3. Obtener la cita y verificar que pertenece al paciente
            # Buscar la cita por event_id (puede requerir buscar todas las citas del paciente y filtrar)
            appointments_data = get_appointments_flexible(patient_file_id=patient_file_id, limit=100)
            appointments = appointments_data.get("appointments", [])
            cita = next((a for a in appointments if str(a.get("idEvent")) == str(event_id)), None)
            if not cita:
                raise HTTPException(status_code=403, detail="La cita no pertenece al paciente con ese correo electrónico.")

            # 4. Si todo coincide, proceder con el reagendamiento
            return reschedule_appointment(
                appointment_id=event_id,
                data={
                    "source_event": data.get("source_event"),
                    "start_date": data["start_date"],
                    "end_date": data.get("end_date", data["start_date"]),
                    "time_from": data["time_from"],
                    "time_to": data["time_to"],
                    "isStatusModifiedByPatient": data.get("is_status_modified_by_patient", True)
                }
            )

        elif tool_name == "consultar_disponibilidad":
            # Validar parámetros obligatorios y formatos
            validate_required_params(data, ["doctor_id", "clinic_id", "from", "to"])
            # Forzar a string si llegan como número
            data["doctor_id"] = str(data["doctor_id"])
            data["clinic_id"] = str(data["clinic_id"])
            validate_id(data["doctor_id"], "doctor_id")
            validate_id(data["clinic_id"], "clinic_id")
            from_date = validate_and_format_date(data["from"], "from")
            to_date = validate_and_format_date(data["to"], "to")
            response = get_availability(
                doctor_id=data["doctor_id"],
                clinic_id=data["clinic_id"],
                from_date=from_date,
                to_date=to_date
            )
            slots = response.get("slotDates", [])
            return {"slotDates": slots}

        elif tool_name == "obtener_doctores":
            validate_required_params(data, ["clinic_id"])
            validate_id(data["clinic_id"], "clinic_id")
            return get_available_doctors(clinic_id=data["clinic_id"])

        elif tool_name == "obtener_doctor":
            validate_required_params(data, ["doctor_id"])
            validate_id(data["doctor_id"], "doctor_id")
            return get_doctor(doctor_id=data["doctor_id"])

        elif tool_name == "obtener_paciente":
            validate_required_params(data, ["patient_file_id"])
            validate_id(data["patient_file_id"], "patient_file_id")
            return get_patient(patient_file_id=data["patient_file_id"])

        elif tool_name == "buscar_paciente_externo":
            validate_required_params(data, ["external_id"])
            return get_patient_by_external_id(external_id=data["external_id"])

        elif tool_name == "obtener_citas":
            # Puede buscar por doctor o paciente
            if not data.get("doctor_id") and not data.get("patient_file_id"):
                raise HTTPException(status_code=400, detail="Debes enviar 'doctor_id' o 'patient_file_id'")
            if data.get("doctor_id"):
                validate_id(data["doctor_id"], "doctor_id")
            if data.get("patient_file_id"):
                validate_id(data["patient_file_id"], "patient_file_id")
            if data.get("from"):
                data["from"] = validate_and_format_date(data["from"], "from")
            if data.get("to"):
                data["to"] = validate_and_format_date(data["to"], "to")
            return get_appointments_flexible(
                doctor_id=data.get("doctor_id"),
                patient_file_id=data.get("patient_file_id"),
                from_date=data.get("from"),
                to_date=data.get("to"),
                limit=data.get("limit", 20),
                offset=data.get("offset", 0),
                status_appointment=data.get("status_appointment"),
                id_clinic=data.get("id_clinic")
            )

        elif tool_name == "obtener_clinicas":
            return get_clinics()

        elif tool_name == "obtener_clinica":
            validate_required_params(data, ["clinic_id"])
            validate_id(data["clinic_id"], "clinic_id")
            return get_clinic(clinic_id=data["clinic_id"])

        elif tool_name == "obtener_token":
            validate_required_params(data, ["api_key"])
            return get_token(api_key=data["api_key"])

        elif tool_name == "get_medical_record":
            validate_required_params(data, ["patient_id", "owner_id"])
            validate_id(data["patient_id"], "patient_id")
            validate_id(data["owner_id"], "owner_id")
            return get_medical_record(patient_id=data["patient_id"], owner_id=data["owner_id"])

        elif tool_name == "get_checkup":
            validate_required_params(data, ["event_id"])
            validate_id(data["event_id"], "event_id")
            return get_checkup(event_id=data["event_id"])

        elif tool_name == "get_checkup_note":
            validate_required_params(data, ["event_id"])
            validate_id(data["event_id"], "event_id")
            return get_checkup_note(event_id=data["event_id"])

        elif tool_name == "get_checkup_diagnosis":
            validate_required_params(data, ["event_id"])
            validate_id(data["event_id"], "event_id")
            return get_checkup_diagnosis(event_id=data["event_id"])

        elif tool_name == "get_checkup_prescription":
            validate_required_params(data, ["event_id"])
            validate_id(data["event_id"], "event_id")
            return get_checkup_prescription(event_id=data["event_id"])

        elif tool_name == "get_checkup_vital_signs":
            validate_required_params(data, ["event_id"])
            validate_id(data["event_id"], "event_id")
            return get_checkup_vital_signs(event_id=data["event_id"])

        elif tool_name == "get_checkup_lab_procedure_request":
            validate_required_params(data, ["event_id"])
            validate_id(data["event_id"], "event_id")
            return get_checkup_lab_procedure_request(event_id=data["event_id"])

        elif tool_name == "get_checkup_suffering":
            validate_required_params(data, ["event_id"])
            validate_id(data["event_id"], "event_id")
            return get_checkup_suffering(event_id=data["event_id"])

        elif tool_name == "get_checkup_reason_of_visit":
            validate_required_params(data, ["event_id"])
            validate_id(data["event_id"], "event_id")
            return get_checkup_reason_of_visit(event_id=data["event_id"])

        elif tool_name == "get_checkup_physical_note":
            validate_required_params(data, ["event_id"])
            validate_id(data["event_id"], "event_id")
            return get_checkup_physical_note(event_id=data["event_id"])

        elif tool_name == "get_checkup_anthropometric_data":
            validate_required_params(data, ["event_id"])
            validate_id(data["event_id"], "event_id")
            return get_checkup_anthropometric_data(event_id=data["event_id"])

        elif tool_name == "get_checkup_review_of_systems":
            validate_required_params(data, ["event_id"])
            validate_id(data["event_id"], "event_id")
            return get_checkup_review_of_systems(event_id=data["event_id"])

        elif tool_name == "get_checkup_systematic_examination":
            validate_required_params(data, ["event_id"])
            validate_id(data["event_id"], "event_id")
            return get_checkup_systematic_examination(event_id=data["event_id"])

        elif tool_name == "get_checkup_sleep_pattern":
            validate_required_params(data, ["event_id"])
            validate_id(data["event_id"], "event_id")
            return get_checkup_sleep_pattern(event_id=data["event_id"])

        elif tool_name == "get_checkup_bowel_habit":
            validate_required_params(data, ["event_id"])
            validate_id(data["event_id"], "event_id")
            return get_checkup_bowel_habit(event_id=data["event_id"])

        elif tool_name == "get_checkup_plan_note":
            validate_required_params(data, ["event_id"])
            validate_id(data["event_id"], "event_id")
            return get_checkup_plan_note(event_id=data["event_id"])

        elif tool_name == "get_checkup_custom_questions":
            validate_required_params(data, ["event_id"])
            validate_id(data["event_id"], "event_id")
            return get_checkup_custom_questions(event_id=data["event_id"])

        elif tool_name == "get_checkup_last_menstrual_cycle":
            validate_required_params(data, ["event_id"])
            validate_id(data["event_id"], "event_id")
            return get_checkup_last_menstrual_cycle(event_id=data["event_id"])

        elif tool_name == "create_patient_file":
            validate_required_params(data, ["data"])
            return create_patient_file(data=data["data"])

        elif tool_name == "list_patient_files":
            validate_required_params(data, ["query", "limit", "offset"])
            return list_patient_files(query=data.get("query"), limit=data.get("limit", 20), offset=data.get("offset", 0))

        elif tool_name == "get_patient_file":
            validate_required_params(data, ["patient_file_id"])
            validate_id(data["patient_file_id"], "patient_file_id")
            return get_patient_file(patient_file_id=data["patient_file_id"])

        elif tool_name == "upload_patient_document":
            validate_required_params(data, ["patient_file_id", "owner_id", "data"])
            validate_id(data["patient_file_id"], "patient_file_id")
            validate_id(data["owner_id"], "owner_id")
            return upload_patient_document(patient_file_id=data["patient_file_id"], owner_id=data["owner_id"], data=data["data"])

        elif tool_name == "get_organization":
            return get_organization(expand=data.get("expand"))

        elif tool_name == "list_appointment_tags":
            validate_required_params(data, ["limit", "offset"])
            return list_appointment_tags(limit=data.get("limit", 10), offset=data.get("offset", 0))

        elif tool_name == "get_most_used_appointment_colors":
            validate_required_params(data, ["limit"])
            return get_most_used_appointment_colors(
                doctor_id=data.get("doctor_id"),
                clinic_id=data.get("clinic_id"),
                patient_file_id=data.get("patient_file_id"),
                from_date=data.get("from"),
                to_date=data.get("to"),
                status_appointment=data.get("status_appointment"),
                limit=data.get("limit", 1000)
            )

        elif tool_name == "get_appointment_by_id":
            validate_required_params(data, ["event_id"])
            validate_id(data["event_id"], "event_id")
            return get_appointment_by_id(event_id=data["event_id"])

        elif tool_name == "update_appointment":
            validate_required_params(data, ["event_id", "data"])
            validate_id(data["event_id"], "event_id")
            return update_appointment(event_id=data["event_id"], data=data["data"])

        elif tool_name == "confirm_appointment":
            validate_required_params(data, ["event_id"])
            validate_id(data["event_id"], "event_id")
            return confirm_appointment(event_id=data["event_id"])

        elif tool_name == "mark_no_show":
            validate_required_params(data, ["event_id"])
            validate_id(data["event_id"], "event_id")
            return mark_no_show(event_id=data["event_id"])

        elif tool_name == "get_doctor_by_user":
            validate_required_params(data, ["user_id"])
            validate_id(data["user_id"], "user_id")
            return get_doctor_by_user(user_id=data["user_id"])

        elif tool_name == "get_doctor_clinic_phone":
            validate_required_params(data, ["doctor_id", "clinic_id"])
            validate_id(data["doctor_id"], "doctor_id")
            validate_id(data["clinic_id"], "clinic_id")
            return get_doctor_clinic_phone(doctor_id=data["doctor_id"], clinic_id=data["clinic_id"])

        elif tool_name == "get_doctor_clinic_address":
            validate_required_params(data, ["doctor_id", "clinic_id"])
            validate_id(data["doctor_id"], "doctor_id")
            validate_id(data["clinic_id"], "clinic_id")
            return get_doctor_clinic_address(doctor_id=data["doctor_id"], clinic_id=data["clinic_id"])

        else:
            raise HTTPException(status_code=404, detail=f"Tool '{tool_name}' no encontrada")

    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Parámetro requerido faltante: {e}")

    except requests.HTTPError as e:
        status = e.response.status_code
        error_msg = e.response.json() if e.response.content else str(e)
        raise HTTPException(status_code=status, detail=error_msg)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://huli-mcp.crisoforoibanez.com",
        "https://dacs-bot.crisoforoibanez.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
