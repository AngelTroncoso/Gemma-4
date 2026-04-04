import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getAllergyAdvice = async (userInput: string) => {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: userInput,
      config: {
        systemInstruction: `Eres un asistente experto en bienestar para personas con alergias llamado AllergyCare. 
        Tu objetivo es proporcionar consejos profesionales basados estrictamente en datos científicos y ambientales, evitando invenciones.
        
        FILOSOFÍA DE RECOMENDACIÓN:
        1. PRIORIZA la prevención y el control ambiental para minimizar la exposición a alérgenos.
        2. BUSCA soluciones a largo plazo y cambios en el estilo de vida (solución final).
        3. MINIMIZA la recomendación de medicamentos, sugiriéndolos solo como último recurso y siempre bajo supervisión médica.
        4. NO eres médico. SIEMPRE incluye un aviso de que tus consejos no sustituyen la consulta profesional.
        5. Si el usuario describe síntomas graves (dificultad para respirar, hinchazón extrema, anafilaxia), indícale que busque ayuda de emergencia INMEDIATAMENTE.
        6. Usa un tono empático, calmado y profesional.
        7. Responde en el idioma en que el usuario te hable.
        8. Estructura tus respuestas con puntos claros y fáciles de leer.`,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini:", error);
    throw new Error("No pudimos obtener una recomendación en este momento.");
  }
};

export const getGroundedWeatherData = async (location: string) => {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Proporciona un informe detallado sobre el clima y la calidad del aire en ${location}, específicamente enfocado en riesgos para personas alérgicas (niveles de polen, humedad, contaminación). Incluye recomendaciones prácticas basadas en las condiciones actuales.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "Eres un experto en meteorología y salud ambiental. Tu objetivo es proporcionar información precisa y útil para personas con alergias, basándote en datos de búsqueda en tiempo real.",
      },
    });

    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.web?.uri).filter(Boolean) || []
    };
  } catch (error) {
    console.error("Error calling Gemini with grounding:", error);
    throw new Error("No pudimos obtener información detallada para esa ubicación.");
  }
};

export const getLocationInsights = async (location: string, lat?: number, lng?: number) => {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Encuentra lugares relevantes para una persona con alergias en ${location} (como farmacias 24h, clínicas de alergología o parques con mucha vegetación que evitar). Proporciona una lista útil con recomendaciones.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: lat && lng ? { latitude: lat, longitude: lng } : undefined
          }
        }
      },
    });

    return {
      text: response.text,
      places: response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.filter(chunk => chunk.maps)
        ?.map(chunk => ({
          uri: chunk.maps?.uri,
          title: chunk.maps?.title
        })) || []
    };
  } catch (error) {
    console.error("Error calling Gemini with Maps:", error);
    return { text: "", places: [] };
  }
};
