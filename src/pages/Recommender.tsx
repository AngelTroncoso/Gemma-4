import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { getAllergyAdvice } from '@/src/services/gemini';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/src/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const Recommender = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'chat' | 'form'>('chat');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const advice = await getAllergyAdvice(messageText);
      const assistantMessage: Message = { role: 'assistant', content: advice || 'Lo siento, no pude procesar eso.' };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = { role: 'assistant', content: 'Hubo un error al conectar con la IA. Por favor, intenta de nuevo.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickSymptoms = [
    "Picor en los ojos y estornudos",
    "Erupción cutánea tras comer",
    "Congestión nasal matutina",
    "Alergia al pelo de gato"
  ];

  return (
    <div className="min-h-screen pt-24 pb-32 px-4 md:px-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">Asistente Inteligente</h1>
        <p className="text-slate-500">Describe tus síntomas o elige una opción rápida</p>
      </div>

      {/* Chat Container */}
      <div className="glass-card h-[60vh] md:h-[65vh] flex flex-col overflow-hidden">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60">
              <Sparkles className="w-12 h-12 text-emerald-400" />
              <div>
                <p className="font-medium mb-2">¿Cómo te sientes hoy?</p>
                <p className="text-sm max-w-xs">Cuéntame tus síntomas o qué tipo de alergia te preocupa.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {quickSymptoms.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="text-xs bg-white border border-slate-200 px-3 py-2 rounded-full hover:border-emerald-400 hover:text-emerald-600 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-emerald-500 text-white rounded-tr-none" 
                    : "bg-slate-100 text-slate-800 rounded-tl-none markdown-body"
                )}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-2">
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-100 bg-white/50">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tus síntomas aquí..."
              className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
            />
            <Button 
              onClick={() => handleSend()} 
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2 h-10 w-10 rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 flex items-center justify-center gap-1">
            <AlertCircle className="w-3 h-3" />
            No sustituye consejo médico profesional.
          </p>
        </div>
      </div>
    </div>
  );
};
