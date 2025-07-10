import re
from datetime import datetime, timezone
from fastapi import HTTPException

from hulihealth_mcp.mcp_types import SchemaResponse, ObjectResponse, MCPObject
from hulihealth_mcp.huli_api import get_availability

def build_mcp_schema() -> SchemaResponse:
    return SchemaResponse(
        types={
            "Availability": {
                "properties": {
                    "doctor_id": "string",
                    "clinic_id": "string",
                    "slot_time": "string",
                    "source_event": "string"
                }
            },
            "Appointment": {
                "properties": {
                    "id": "string",
                    "doctor_id": "string",
                    "clinic_id": "string",
                    "patient_file_id": "string",
                    "start_date": "string",
                    "end_date": "string",
                    "status": "string"
                }
            },
            "Doctor": {
                "properties": {
                    "id": "string",
                    "user_id": "string",
                    "name": "string",
                    "specialty": "string"
                }
            },
            "Clinic": {
                "properties": {
                    "id": "string",
                    "name": "string",
                    "address": "string",
                    "phone": "string"
                }
            }
        }
    )

def build_objects_response(doctor_id: str, clinic_id: str) -> ObjectResponse:
    data = get_availability(doctor_id, clinic_id)
    objects = []

    for day in data.get("slotDates", []):
        for slot in day.get("slots", []):
            objects.append(MCPObject(
                type="Availability",
                id=f"{data['idDoctor']}-{slot['dateTime']}",
                properties={
                    "doctor_id": data["idDoctor"],
                    "clinic_id": data["idClinic"],
                    "slot_time": slot["dateTime"],
                    "source_event": slot["sourceEvent"]
                }
            ))
    return ObjectResponse(objects=objects)


def validate_required_params(data, required_params):
    for param in required_params:
        if param not in data or data[param] in (None, ""):
            raise HTTPException(status_code=400, detail=f"Falta el parámetro obligatorio: {param}")


def validate_and_format_date(date_str, param_name):
    if not date_str:
        raise HTTPException(status_code=400, detail=f"Falta el parámetro de fecha: {param_name}")
    try:
        # Acepta fechas con o sin zona horaria
        dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        # Convierte a UTC y formatea
        dt_utc = dt.astimezone(timezone.utc)
        return dt_utc.strftime("%Y-%m-%dT%H:%M:%SZ")
    except Exception:
        raise HTTPException(status_code=400, detail=f"El formato de la fecha '{param_name}' es inválido. Usa ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)")


def validate_id(id_value, param_name):
    if not isinstance(id_value, str) or not id_value.strip():
        raise HTTPException(status_code=400, detail=f"El parámetro '{param_name}' debe ser una cadena no vacía.")
