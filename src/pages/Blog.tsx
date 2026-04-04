import { motion } from 'framer-motion';
import { BookOpen, Clock, ChevronRight } from 'lucide-react';

const articles = [
  {
    title: "Cómo preparar tu casa para la primavera",
    category: "Prevención",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800",
    desc: "Consejos prácticos para reducir el polen en interiores y mejorar la calidad del aire en tu hogar."
  },
  {
    title: "Alergias alimentarias: Guía para principiantes",
    category: "Educación",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800",
    desc: "Aprende a leer etiquetas y a identificar ingredientes ocultos que podrían causar reacciones."
  },
  {
    title: "Remedios naturales para la rinitis",
    category: "Consejos",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800",
    desc: "Desde lavados nasales hasta infusiones que pueden ayudarte a mitigar los síntomas leves."
  }
];

export const Blog = () => {
  return (
    <div className="min-h-screen pt-24 pb-32 px-6 max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-display font-bold mb-2">Consejos y Artículos</h1>
        <p className="text-slate-500">Aprende más sobre cómo convivir con tus alergias.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((article, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card overflow-hidden group cursor-pointer"
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-3 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                <span>{article.category}</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3" />
                  {article.readTime}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-emerald-600 transition-colors">
                {article.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                {article.desc}
              </p>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                Leer más
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};
