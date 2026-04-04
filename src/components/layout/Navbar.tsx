import { Link, useLocation } from 'react-router-dom';
import { Wind, MessageSquare, Home, BookOpen, User, LogOut } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuthStore } from '@/src/store/useAuthStore';

export const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const navItems = [
    { path: '/', label: 'Inicio', icon: Home },
    { path: '/recommender', label: 'IA Consejos', icon: MessageSquare },
    { path: '/weather', label: 'Clima', icon: Wind },
    { path: '/blog', label: 'Blog', icon: BookOpen },
    { path: '/community', label: 'Comunidad', icon: User },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-md md:top-6 md:bottom-auto md:max-w-4xl">
      <div className="glass-card px-4 py-3 flex items-center justify-between md:px-8">
        <Link to="/" className="hidden md:flex items-center gap-2 font-display font-bold text-emerald-600 text-xl">
          <Wind className="w-6 h-6" />
          AllergyCare
        </Link>
        
        <div className="flex items-center justify-around w-full md:w-auto md:gap-6 lg:gap-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 transition-colors md:flex-row md:gap-2",
                  isActive ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Icon className="w-5 h-5 md:w-4 md:h-4" />
                <span className="text-[9px] font-medium md:text-xs lg:text-sm">{item.label}</span>
              </Link>
            );
          })}
          
          {user && (
            <button 
              onClick={logout}
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-rose-500 transition-colors md:flex-row md:gap-2"
            >
              <LogOut className="w-5 h-5 md:w-4 md:h-4" />
              <span className="text-[9px] font-medium md:text-xs lg:text-sm">Salir</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
