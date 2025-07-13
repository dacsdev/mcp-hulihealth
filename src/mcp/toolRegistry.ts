const scheduleAppointment = require('../tools/scheduleAppointment');
const cancelAppointment = require('../tools/cancelAppointment');
const rescheduleAppointment = require('../tools/rescheduleAppointment');
const getAvailability = require('../tools/getAvailability');
const getAppointments = require('../tools/getAppointments');
const getAppointmentById = require('../tools/getAppointmentById');
const updateAppointment = require('../tools/updateAppointment');
const confirmAppointment = require('../tools/confirmAppointment');
const markNoShow = require('../tools/markNoShow');
const getMostUsedAppointmentColors = require('../tools/getMostUsedAppointmentColors');
const listAppointmentTags = require('../tools/listAppointmentTags');
const getOrganization = require('../tools/getOrganization');
const getDoctor = require('../tools/getDoctor');
const getDoctorByUser = require('../tools/getDoctorByUser');
const getDoctorClinicPhone = require('../tools/getDoctorClinicPhone');
const getDoctorClinicAddress = require('../tools/getDoctorClinicAddress');
const getPatient = require('../tools/getPatient');
const getPatientByExternalId = require('../tools/getPatientByExternalId');
const createPatientFile = require('../tools/createPatientFile');
const listPatientFiles = require('../tools/listPatientFiles');
const getPatientFile = require('../tools/getPatientFile');
const uploadPatientDocument = require('../tools/uploadPatientDocument');
const getClinics = require('../tools/getClinics');
const getClinic = require('../tools/getClinic');
const getMedicalRecord = require('../tools/getMedicalRecord');
const getCheckup = require('../tools/getCheckup');
const getCheckupNote = require('../tools/getCheckupNote');
const getCheckupDiagnosis = require('../tools/getCheckupDiagnosis');
const getCheckupPrescription = require('../tools/getCheckupPrescription');
const getCheckupVitalSigns = require('../tools/getCheckupVitalSigns');
const getCheckupLabProcedureRequest = require('../tools/getCheckupLabProcedureRequest');
const getCheckupSuffering = require('../tools/getCheckupSuffering');
const getCheckupReasonOfVisit = require('../tools/getCheckupReasonOfVisit');
const getCheckupPhysicalNote = require('../tools/getCheckupPhysicalNote');
const getCheckupAnthropometricData = require('../tools/getCheckupAnthropometricData');
const getCheckupReviewOfSystems = require('../tools/getCheckupReviewOfSystems');
const getCheckupSystematicExamination = require('../tools/getCheckupSystematicExamination');
const getCheckupSleepPattern = require('../tools/getCheckupSleepPattern');
const getCheckupBowelHabit = require('../tools/getCheckupBowelHabit');
const getCheckupPlanNote = require('../tools/getCheckupPlanNote');
const getCheckupCustomQuestions = require('../tools/getCheckupCustomQuestions');
const getCheckupLastMenstrualCycle = require('../tools/getCheckupLastMenstrualCycle');

const allTools = [
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

const validTools = allTools.filter(tool => tool && typeof tool.execute === 'function');

if (validTools.length !== allTools.length) {
    console.error("[MCP Registry Warning] Se detectaron y filtraron tools no válidos o mal formados. Revisa tus archivos de tools.");
}

module.exports = {
  tools: validTools
};