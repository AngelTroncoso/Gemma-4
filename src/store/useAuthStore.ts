import { create } from 'zustand';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, User, db, doc, setDoc, getDoc } from '@/src/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  init: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  login: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Sync with Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName || 'Usuario',
          photoURL: user.photoURL || '',
          bio: '',
          role: 'user'
        });
      }
      
      set({ user });
    } catch (error) {
      console.error("Login Error:", error);
    }
  },
  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },
  init: () => {
    onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
  }
}));
