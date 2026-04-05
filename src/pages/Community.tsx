import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Heart, Send, User, LogIn, Loader2, Share } from 'lucide-react';
import { useAuthStore } from '@/src/store/useAuthStore';
import { db, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, handleFirestoreError, OperationType } from '@/src/firebase';
import { Button } from '@/src/components/ui/Button';

interface Post {
  id: string;
  authorUid: string;
  authorName: string;
  authorPhoto: string;
  content: string;
  createdAt: any;
  likes: number;
}

export const Community = () => {
  const { user, loading: authLoading, login } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const path = 'posts';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsubscribe();
  }, [user]);

  const handlePost = async () => {
    if (!user || !newPost.trim()) return;
    const path = 'posts';
    try {
      await addDoc(collection(db, path), {
        authorUid: user.uid,
        authorName: user.displayName,
        authorPhoto: user.photoURL,
        content: newPost,
        createdAt: serverTimestamp(),
        likes: 0
      });
      setNewPost('');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="glass-card p-10 max-w-sm">
          <LogIn className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Únete a la Comunidad</h2>
          <p className="text-slate-500 mb-8">Inicia sesión para compartir tus experiencias y conectar con otros alérgicos.</p>
          <Button onClick={login} className="w-full">
            Iniciar sesión con Google
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-32 px-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-display font-bold mb-8">Comunidad</h1>

      {/* New Post Input */}
      <div className="glass-card p-6 mb-8">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="¿Cómo te sientes hoy? Comparte un consejo o tu experiencia..."
          className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none resize-none h-24"
        />
        <div className="flex justify-end mt-4">
          <Button onClick={handlePost} disabled={!newPost.trim()}>
            Publicar
          </Button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-emerald-500" /></div>
        ) : (
          posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={post.authorPhoto || `https://ui-avatars.com/api/?name=${post.authorName}`} 
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full bg-slate-200"
                />
                <div>
                  <h4 className="font-bold text-sm">{post.authorName}</h4>
                  <span className="text-[10px] text-slate-400">
                    {post.createdAt?.toDate().toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed mb-6">
                {post.content}
              </p>
              <div className="flex items-center gap-6 text-slate-400">
                <button className="flex items-center gap-1 hover:text-rose-500 transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1 hover:text-emerald-500 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs">Comentar</span>
                </button>
                <button 
                  onClick={() => {
                    const baseUrl = window.location.hostname.includes('web.app') 
                      ? window.location.origin 
                      : 'https://gen-lang-client-0759773731.web.app';
                    const shareUrl = `${baseUrl}/community?post=${post.id}`;
                    navigator.clipboard.writeText(shareUrl);
                    alert('¡Enlace del post copiado al portapapeles!');
                  }}
                  className="flex items-center gap-1 hover:text-sky-500 transition-colors ml-auto"
                >
                  <Share className="w-4 h-4" />
                  <span className="text-xs">Compartir</span>
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
