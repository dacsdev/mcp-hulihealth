import cancelAppointment from '../tools/cancelAppointment.js';
import confirmAppointment from '../tools/confirmAppointment.js';
import createPatientFile from '../tools/createPatientFile.js';
import getAppointmentById from '../tools/getAppointmentById.js';
import getAppointments from '../tools/getAppointments.js';
import getAvailability from '../tools/getAvailability.js';
import getCheckup from '../tools/getCheckup.js';
import getCheckupAnthropometricData from '../tools/getCheckupAnthropometricData.js';
import getCheckupBowelHabit from '../tools/getCheckupBowelHabit.js';
import getCheckupCustomQuestions from '../tools/getCheckupCustomQuestions.js';
import getCheckupDiagnosis from '../tools/getCheckupDiagnosis.js';
import getCheckupLabProcedureRequest from '../tools/getCheckupLabProcedureRequest.js';
import getCheckupLastMenstrualCycle from '../tools/getCheckupLastMenstrualCycle.js';
import getCheckupNote from '../tools/getCheckupNote.js';
import getCheckupPhysicalNote from '../tools/getCheckupPhysicalNote.js';
import getCheckupPlanNote from '../tools/getCheckupPlanNote.js';
import getCheckupPrescription from '../tools/getCheckupPrescription.js';
import getCheckupReasonOfVisit from '../tools/getCheckupReasonOfVisit.js';
import getCheckupReviewOfSystems from '../tools/getCheckupReviewOfSystems.js';
import getCheckupSleepPattern from '../tools/getCheckupSleepPattern.js';
import getCheckupSuffering from '../tools/getCheckupSuffering.js';
import getCheckupSystematicExamination from '../tools/getCheckupSystematicExamination.js';
import getCheckupVitalSigns from '../tools/getCheckupVitalSigns.js';
import getClinic from '../tools/getClinic.js';
import getClinics from '../tools/getClinics.js';
import getDoctor from '../tools/getDoctor.js';
import getDoctorByUser from '../tools/getDoctorByUser.js';
import getDoctorClinicAddress from '../tools/getDoctorClinicAddress.js';
import getDoctorClinicPhone from '../tools/getDoctorClinicPhone.js';
import getMedicalRecord from '../tools/getMedicalRecord.js';
import getMostUsedAppointmentColors from '../tools/getMostUsedAppointmentColors.js';
import getOrganization from '../tools/getOrganization.js';
import getPatient from '../tools/getPatient.js';
import getPatientByExternalId from '../tools/getPatientByExternalId.js';
import getPatientFile from '../tools/getPatientFile.js';
import listAppointmentTags from '../tools/listAppointmentTags.js';
import listPatientFiles from '../tools/listPatientFiles.js';
import markNoShow from '../tools/markNoShow.js';
import rescheduleAppointment from '../tools/rescheduleAppointment.js';
import scheduleAppointment from '../tools/scheduleAppointment.js';
import updateAppointment from '../tools/updateAppointment.js';
import uploadPatientDocument from '../tools/uploadPatientDocument.js';

const allTools = [
  cancelAppointment,
  confirmAppointment,
  createPatientFile,
  getAppointmentById,
  getAppointments,
  getAvailability,
  getCheckup,
  getCheckupAnthropometricData,
  getCheckupBowelHabit,
  getCheckupCustomQuestions,
  getCheckupDiagnosis,
  getCheckupLabProcedureRequest,
  getCheckupLastMenstrualCycle,
  getCheckupNote,
  getCheckupPhysicalNote,
  getCheckupPlanNote,
  getCheckupPrescription,
  getCheckupReasonOfVisit,
  getCheckupReviewOfSystems,
  getCheckupSleepPattern,
  getCheckupSuffering,
  getCheckupSystematicExamination,
  getCheckupVitalSigns,
  getClinic,
  getClinics,
  getDoctor,
  getDoctorByUser,
  getDoctorClinicAddress,
  getDoctorClinicPhone,
  getMedicalRecord,
  getMostUsedAppointmentColors,
  getOrganization,
  getPatient,
  getPatientByExternalId,
  getPatientFile,
  listAppointmentTags,
  listPatientFiles,
  markNoShow,
  rescheduleAppointment,
  scheduleAppointment,
  updateAppointment,
  uploadPatientDocument,
];
const validTools = allTools.filter(tool => tool && typeof tool.execute === 'function');

if (validTools.length !== allTools.length) {
  console.error('[MCP Registry Warning] Se detectaron y filtraron tools no válidos o mal formados. Revisa tus archivos de tools.');
}
export const tools = validTools;

