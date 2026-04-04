import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Home } from './pages/Home';
import { Recommender } from './pages/Recommender';
import { Weather } from './pages/Weather';
import { Community } from './pages/Community';
import { Blog } from './pages/Blog';
import { useAuthStore } from './store/useAuthStore';

export default function App() {
  const initAuth = useAuthStore(state => state.init);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recommender" element={<Recommender />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/community" element={<Community />} />
          </Routes>
        </main>
        
        <footer className="py-12 px-6 text-center text-slate-400 text-sm border-t border-slate-100">
          <p>© 2026 AllergyCare. Este sitio no proporciona consejos médicos profesionales.</p>
        </footer>
      </div>
    </Router>
  );
}
