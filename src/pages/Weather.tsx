import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Thermometer, Droplets, AlertTriangle, MapPin, Loader2, Search, ExternalLink, Sparkles, Navigation, Map as MapIcon } from 'lucide-react';
import { getWeatherData, WeatherData } from '@/src/services/weather';
import { getGroundedWeatherData, getLocationInsights } from '@/src/services/gemini';
import { cn } from '@/src/lib/utils';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/src/components/ui/Button';

export const Weather = () => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [groundedData, setGroundedData] = useState<{ text: string; sources: string[] } | null>(null);
  const [placeInsights, setPlaceInsights] = useState<{ text: string; places: any[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasAttemptedLocation, setHasAttemptedLocation] = useState(false);

  const fetchWeatherByCoords = (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    Promise.all([
      getWeatherData(lat, lon),
      getGroundedWeatherData("mi ubicación actual"),
      getLocationInsights("mi ubicación actual", lat, lon)
    ]).then(([weather, grounded, insights]) => {
      setData(weather);
      setGroundedData(grounded);
      setPlaceInsights(insights);
    }).catch(() => {
      setError("No pudimos obtener todos los datos. Intenta buscar una ciudad manualmente.");
    }).finally(() => {
      setLoading(false);
      setHasAttemptedLocation(true);
    });
  };

  const requestLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      () => {
        setError("Acceso a ubicación denegado. Por favor, ingresa tu ciudad manualmente.");
        setLoading(false);
        setHasAttemptedLocation(true);
      }
    );
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setError(null);
    try {
      const [grounded, insights] = await Promise.all([
        getGroundedWeatherData(searchQuery),
        getLocationInsights(searchQuery)
      ]);
      setGroundedData(grounded);
      setPlaceInsights(insights);
      setData(null); // API numeric data is lat/lon based, we rely on AI for search results
    } catch (err) {
      setError("No pudimos encontrar información para esa ubicación.");
    } finally {
      setSearching(false);
      setHasAttemptedLocation(true);
    }
  };

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return { label: "Excelente", color: "text-emerald-500", bg: "bg-emerald-50" };
    if (aqi <= 100) return { label: "Moderado", color: "text-amber-500", bg: "bg-amber-50" };
    return { label: "Riesgo Alto", color: "text-rose-500", bg: "bg-rose-50" };
  };

  const aqiStatus = data ? getAQIStatus(data.aqi) : null;

  return (
    <div className="min-h-screen pt-24 pb-32 px-6 max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-display font-bold mb-4">Estado Ambiental</h1>
        <p className="text-slate-500 max-w-2xl">
          Es necesario ingresar una ciudad o permitir tu ubicación para mostrar los datos ambientales asociados y riesgos para tu salud.
        </p>
      </header>

      {/* Search & Location Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Busca una ciudad (ej: Madrid, Bogotá)..."
            className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-4 text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none shadow-sm"
          />
          <Button 
            type="submit" 
            disabled={searching} 
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10"
          >
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Consultar"}
          </Button>
        </form>
        
        <Button 
          variant="outline" 
          onClick={requestLocation} 
          disabled={loading}
          className="md:w-auto w-full h-[58px] gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
          Detectar mi ubicación
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {!hasAttemptedLocation && !data && !groundedData ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 text-center flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <Wind className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-4">¡Hola! Empecemos por tu ubicación</h2>
            <p className="text-slate-500 max-w-md mb-8">
              Para darte un reporte preciso sobre polen, calidad del aire y riesgos locales, necesitamos saber dónde te encuentras.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={requestLocation} className="gap-2">
                <Navigation className="w-4 h-4" />
                Usar ubicación actual
              </Button>
              <span className="text-slate-300 flex items-center justify-center">o</span>
              <p className="text-slate-600 flex items-center font-medium">Usa el buscador de arriba</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Numeric Dashboard */}
            {data && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={cn("glass-card p-8 flex flex-col items-center justify-center text-center", aqiStatus?.bg)}>
                  <span className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Calidad del Aire</span>
                  <span className={cn("text-6xl font-bold mb-2", aqiStatus?.color)}>{data.aqi}</span>
                  <span className={cn("text-xl font-semibold", aqiStatus?.color)}>{aqiStatus?.label}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-6 flex flex-col items-center justify-center">
                    <Thermometer className="w-6 h-6 text-orange-400 mb-2" />
                    <span className="text-2xl font-bold">{data.temp}°C</span>
                    <span className="text-xs text-slate-400">Temperatura</span>
                  </div>
                  <div className="glass-card p-6 flex flex-col items-center justify-center">
                    <Wind className="w-6 h-6 text-sky-400 mb-2" />
                    <span className="text-2xl font-bold">{data.condition}</span>
                    <span className="text-xs text-slate-400">Condición</span>
                  </div>
                </div>
              </div>
            )}

            {/* AI Insights & Maps */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {groundedData && (
                  <div className="glass-card p-8 bg-emerald-50/30 border-emerald-100">
                    <div className="flex items-center gap-2 mb-6 text-emerald-700">
                      <Sparkles className="w-5 h-5" />
                      <h3 className="text-xl font-display font-bold">Análisis de IA</h3>
                    </div>
                    <div className="markdown-body text-slate-700 text-sm leading-relaxed">
                      <ReactMarkdown>{groundedData.text}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {placeInsights && placeInsights.places.length > 0 && (
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-6 text-slate-800">
                      <MapIcon className="w-5 h-5 text-sky-500" />
                      <h3 className="font-bold">Lugares de Interés</h3>
                    </div>
                    <div className="space-y-3">
                      {placeInsights.places.map((place, i) => (
                        <a 
                          key={i} 
                          href={place.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-sky-50 transition-colors group border border-transparent hover:border-sky-100"
                        >
                          <span className="text-xs font-medium text-slate-700 truncate pr-2">{place.title}</span>
                          <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-sky-500" />
                        </a>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-4 leading-tight">
                      Basado en datos de Google Maps para tu zona.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="mt-8 glass-card p-6 border-rose-100 bg-rose-50 text-center">
          <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-3" />
          <p className="text-slate-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};
