import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useWeatherStore } from './store/weatherStore';
import { useAuthStore } from './store/authStore';
import { Home } from './pages/Home';
import { Settings } from './pages/Settings';
import { Navigation } from './components/Navigation';
import { Login } from './pages/Login';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';

const queryClient = new QueryClient();

function App() {
  const { preferences } = useWeatherStore();
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.theme]);

  const isDark = preferences.theme === 'dark';

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className={isDark ? 'dark' : ''}>
          <Toaster
            theme={isDark ? 'dark' : 'light'}
            position="top-right"
            closeButton
            richColors
            toastOptions={{
              style: {
                background: isDark ? '#1f2937' : '#ffffff',
                color: isDark ? '#ffffff' : '#1f2937',
                border: '1px solid rgba(156, 163, 175, 0.2)',
              },
            }}
          />
          {user && <Navigation />}
          <div className={`min-h-screen ${
            isDark ? 'bg-gray-900 text-white' : 'bg-blue-50 text-gray-900'
          }`}>
            {user && (
              <div className="h-16" /> // Spacer for header
            )}
            <div className={user ? 'container mx-auto px-4 py-8' : ''}>
              <Routes>
                <Route path="/" element={!user ? <Login /> : <Navigate to="/home" />} />
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
                <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
                <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;