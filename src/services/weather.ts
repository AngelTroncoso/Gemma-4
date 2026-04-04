export interface WeatherData {
  temp: number;
  condition: string;
  aqi: number;
  pollen: {
    grass: number;
    tree: number;
    weed: number;
  };
  location: string;
}

export const getWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    // Fetch Weather
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    const weatherData = await weatherRes.json();

    // Fetch AQI and Pollen (Open-Meteo Air Quality)
    const airRes = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,alnus_pollen,betula_pollen,grass_pollen`
    );
    const airData = await airRes.json();

    if (!weatherData.current_weather) {
      throw new Error("No se pudieron obtener los datos del clima actual.");
    }

    if (!airData.current) {
      // Fallback if current air quality data is missing
      return {
        temp: weatherData.current_weather.temperature,
        condition: "Despejado",
        aqi: 0,
        pollen: { grass: 0, tree: 0, weed: 0 },
        location: "Tu ubicación actual (Datos de aire no disponibles)",
      };
    }

    return {
      temp: weatherData.current_weather.temperature,
      condition: "Despejado", // Simplified for now
      aqi: airData.current.european_aqi || 0,
      pollen: {
        grass: airData.current.grass_pollen || 0,
        tree: (airData.current.alnus_pollen || 0) + (airData.current.betula_pollen || 0),
        weed: 0,
      },
      location: "Tu ubicación actual",
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
};
