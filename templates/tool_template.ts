// Importa las dependencias necesarias usando la sintaxis ESM.
import { z } from 'zod';

// Si necesitas el cliente de Huli, impórtalo así.
// Nota la extensión '.js' al final, es necesaria en proyectos ESM de Node.js.
// import { huliClient } from '../services/huliClient.js';

// Define el esquema de Zod para los parámetros de entrada del tool.
// Usa .describe() para una mejor documentación automática.
const getAvailabilityParams = z.object({
  doctorID: z.string().describe("El ID del doctor para consultar su disponibilidad."),
  clinicID: z.string().describe("El ID de la clínica donde se verificará la disponibilidad."),
  from: z.string().datetime({ message: "La fecha 'from' debe estar en formato ISO 8601" }).describe("Fecha y hora de inicio para el rango de búsqueda (formato ISO 8601)."),
  to: z.string().datetime({ message: "La fecha 'to' debe estar en formato ISO 8601" }).describe("Fecha y hora de fin para el rango de búsqueda (formato ISO 8601)."),
});

// Exporta el tipo inferido de los parámetros. Es una buena práctica para reutilizar el tipo.
export type GetAvailabilityParams = z.infer<typeof getAvailabilityParams>;

// Define el objeto del tool con toda su configuración.
const getAvailabilityTool = {
  name: 'getAvailability',
  description: 'Obtiene los horarios de citas disponibles para un doctor en una clínica y rango de fechas específicos.',
  parameters: getAvailabilityParams,
  
  /**
   * La función principal que ejecuta la lógica del tool.
   * @param params - Objeto con los parámetros de entrada, ya validados por Zod.
   * @returns Un objeto serializable a JSON con el resultado de la operación.
   */
  async execute(params: GetAvailabilityParams) {
    console.log(`[Tool Execution] Ejecutando getAvailability con parámetros:`, params);
    
    try {
      // --- LÓGICA DE LA API AQUÍ ---
      // const availabilityData = await huliClient.getDoctorAvailability(params);
      // return availabilityData;
      
      // Simulación de una respuesta para pruebas:
      const simulatedResult = {
        status: "success",
        message: "Disponibilidad obtenida (simulado).",
        data: [
          { date: "2025-07-15", slots: ["09:00", "09:30", "10:00"] },
          { date: "2025-07-16", slots: ["14:00", "15:00"] }
        ]
      };
      return simulatedResult;

    } catch (error: any) {
      console.error(`Error al ejecutar getAvailability: ${error.message}`);
      throw new Error(`No se pudo obtener la disponibilidad: ${error.message}`);
    }
  }
};

// Exporta el objeto del tool como la exportación por defecto del archivo.
export default getAvailabilityTool;
