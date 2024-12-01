import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useWeatherStore } from '../store/weatherStore';
import { Sun, Moon } from 'lucide-react';
import { LoginForm } from '../components/auth/LoginForm';
import { SocialLogin } from '../components/auth/SocialLogin';

const RainEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajustar el canvas al tamaño de la ventana
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Configuración de las gotas de lluvia
    const drops: { x: number; y: number; speed: number; size: number }[] = [];
    const numberOfDrops = 200;

    // Inicializar gotas
    for (let i = 0; i < numberOfDrops; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 5 + Math.random() * 7,
        size: 1 + Math.random() * 2
      });
    }

    // Efecto de ondas en el agua
    const splashes: { x: number; y: number; size: number; opacity: number }[] = [];

    // Función para dibujar una gota
    const drawDrop = (x: number, y: number, size: number) => {
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + size * 4);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = size;
      ctx.stroke();
    };

    // Función para dibujar una onda
    const drawSplash = (x: number, y: number, size: number, opacity: number) => {
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    // Animación
    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Actualizar y dibujar gotas
      drops.forEach(drop => {
        drop.y += drop.speed;
        drawDrop(drop.x, drop.y, drop.size);

        // Crear splash cuando la gota llega al fondo
        if (drop.y > canvas.height) {
          splashes.push({
            x: drop.x,
            y: canvas.height,
            size: 1,
            opacity: 0.5
          });
          drop.y = -20;
          drop.x = Math.random() * canvas.width;
        }
      });

      // Actualizar y dibujar splashes
      for (let i = splashes.length - 1; i >= 0; i--) {
        const splash = splashes[i];
        splash.size += 0.5;
        splash.opacity -= 0.03;
        drawSplash(splash.x, splash.y, splash.size, splash.opacity);

        if (splash.opacity <= 0) {
          splashes.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
};

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { preferences } = useWeatherStore();
  const isDark = preferences.theme === 'dark';

  const handleEmailLogin = async (email: string, password: string) => {
    try {
      if (email === 'test@gmail.com' && password === 'test123') {
        const testUser = {
          uid: 'test-user',
          email: 'test@gmail.com',
          displayName: 'Usuario de Prueba',
        };
        setUser(testUser as any);
        toast.success('¡Bienvenido Usuario de Prueba!', {
          duration: 4000,
          icon: '👋',
        });
        navigate('/home');
        return;
      }
      toast.error('Credenciales incorrectas');
    } catch (error) {
      toast.error('Error en las credenciales');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (!result.user) {
        throw new Error('No se recibió información del usuario');
      }

      setUser(result.user);
      toast.success(`¡Bienvenido ${result.user.displayName || 'Usuario'}!`, {
        duration: 4000,
        icon: '👋',
      });
      navigate('/home');
    } catch (error: any) {
      console.error('Error en inicio de sesión con Google:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Ventana de inicio de sesión cerrada');
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('El navegador bloqueó la ventana emergente. Por favor, permite ventanas emergentes para este sitio.');
      } else {
        toast.error('Error al iniciar sesión con Google. Por favor, intenta de nuevo.');
      }
    }
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 relative ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900/80 to-gray-900'
        : 'bg-gradient-to-br from-blue-400 via-blue-300 to-blue-400'
    }`}>
      <RainEffect />
      
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-5"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.4
            }}
            className="inline-flex items-center justify-center mb-6"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              className={`w-24 h-24 flex items-center justify-center rounded-full ${
                isDark 
                  ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700'
                  : 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600'
              } shadow-lg shadow-blue-500/20`}
            >
              {isDark ? (
                <Moon className="w-12 h-12 text-white" />
              ) : (
                <Sun className="w-12 h-12 text-white" />
              )}
            </motion.div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`text-5xl font-bold mb-3 ${
              isDark ? 'text-white' : 'text-white'
            }`}
          >
            Climatic
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-lg text-blue-100"
          >
            Tu pronóstico del tiempo personal
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`backdrop-blur-md rounded-3xl p-8 ${
            isDark 
              ? 'bg-gray-900/30 shadow-xl shadow-black/10'
              : 'bg-white/10 shadow-xl shadow-black/5'
          } hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300`}
        >
          <LoginForm onSubmit={handleEmailLogin} isDark={isDark} />
          <SocialLogin 
            onGoogleLogin={handleGoogleLogin}
            isDark={isDark}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-center text-sm text-blue-100"
          >
            ¿Usuario de prueba? Usa: test@gmail.com / test123
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};
