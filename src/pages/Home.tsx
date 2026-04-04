import { motion } from 'framer-motion';
import { Button } from '@/src/components/ui/Button';
import { Wind, ShieldCheck, CloudRain, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

export const Home = () => {
  return (
    <div className="min-h-screen pt-10 pb-32 px-6">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center mt-12 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold text-emerald-700 bg-emerald-100 rounded-full">
            Tu bienestar es nuestra prioridad
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 mb-6 leading-tight">
            Controla tus alergias de forma <span className="text-emerald-500">inteligente</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            Obtén recomendaciones personalizadas por IA, consulta la calidad del aire en tiempo real y únete a una comunidad que te entiende.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/recommender">
              <Button size="lg" className="w-full sm:w-auto">
                Obtener recomendaciones
              </Button>
            </Link>
            <Link to="/community">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Unirse a la comunidad
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "IA Personalizada",
            desc: "Nuestro asistente Gemma 4 analiza tus síntomas y entorno para darte consejos prácticos.",
            icon: ShieldCheck,
            color: "bg-emerald-50 text-emerald-600"
          },
          {
            title: "Calidad del Aire",
            desc: "Datos en tiempo real sobre polen y contaminación según tu ubicación exacta.",
            icon: Wind,
            color: "bg-sky-50 text-sky-600"
          },
          {
            title: "Comunidad Global",
            desc: "Comparte experiencias y encuentra apoyo en nuestro foro especializado.",
            icon: Users,
            color: "bg-indigo-50 text-indigo-600"
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="glass-card p-8 hover:translate-y-[-4px] transition-transform"
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", feature.color)}>
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
};
