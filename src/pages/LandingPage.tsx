'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Coffee, ArrowRight, ShieldCheck, Link as LinkIcon, Gem } from 'lucide-react';

// Hook para Text Scramble - Otimizado
const useScrambleText = (text, speed = 50, enabled = true) => {
  const [displayText, setDisplayText] = useState(enabled ? '' : text);
  
  useEffect(() => {
    if (!enabled) {
      setDisplayText(text);
      return;
    }

    let animationFrame;
    let startTime = null;
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?~abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const iterations = Math.min((progress / speed) * 3, text.length);
      
      setDisplayText(text
        .split('')
        .map((char, index) => {
          if (index < iterations) {
            return text[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('')
      );

      if (iterations < text.length) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const timeout = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate);
    }, 500);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrame);
    };
  }, [text, speed, enabled]);

  return displayText;
};

// Hook para Botão Magnético - Otimizado
const useMagneticButton = (strength = 0.3) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    const magnetX = distanceX * strength;
    const magnetY = distanceY * strength;
    
    setPosition({ x: magnetX, y: magnetY });
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return {
    ref,
    style: { x: position.x, y: position.y },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave
  };
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const mouseMoveTimeout = useRef(null);

  // Scroll Physics - Simplificado
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const skewY = useTransform(smoothVelocity, [-100, 100], [-1, 1]);

  // Text Scramble
  const scrambledTitle1 = useScrambleText("Rastreabilidade");
  const scrambledTitle2 = useScrambleText("Tátil.");
  const scrambledSubtitle = useScrambleText("A Nova Era do Café");

  // Magnetic Button
  const magneticButton = useMagneticButton(0.2);

  // Mouse move throttled
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      if (mouseMoveTimeout.current) {
        return;
      }

      mouseMoveTimeout.current = setTimeout(() => {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        mouseMoveTimeout.current = null;
      }, 16); // ~60fps
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseMoveTimeout.current) {
        clearTimeout(mouseMoveTimeout.current);
      }
    };
  }, []);

  const handleGetStarted = () => {
    navigate('/login');
  };

  const cn = (...classes) => classes.filter(Boolean).join(' ');

  return (
    <motion.div 
      ref={containerRef}
      style={{ skewY }}
      className="relative min-h-screen w-full overflow-x-hidden bg-gray-950 text-white font-sans"
    >
      {/* Background Simplificado */}
      <SimplifiedBackground />

      {/* Background Effects Reduzidos */}
      <div className="absolute inset-0 bg-grid-white/[0.01] bg-[length:80px_80px]" />
      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2">
        <div className="h-[44rem] w-[90rem] bg-[radial-gradient(50%_50%_at_50%_50%,#785a28_0%,rgba(120,90,40,0)_100%)] opacity-10" />
      </div>

      {/* Spotlight Effect Otimizado */}
      <div
        className="pointer-events-none fixed inset-0 z-30 opacity-0 hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(400px at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 90, 40, 0.1), transparent 80%)`,
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gray-950/90 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Coffee className="h-6 w-6 text-amber-400" />
            </div>
            <span className="text-xl font-semibold font-serif text-slate-100">CoffeLedger</span>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-lg border border-amber-400/30 text-amber-400 hover:bg-amber-400/5 transition-colors duration-200"
          >
            Entrar
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center px-4">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-4 font-mono text-sm uppercase tracking-widest text-amber-400/80"
            >
              {scrambledSubtitle}
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-400 sm:text-6xl lg:text-7xl"
            >
              {scrambledTitle1}
              <span className="block bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                {scrambledTitle2}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-6 text-lg leading-8 text-slate-300/90"
            >
              Conecte, rastreie e certifique cada etapa da cadeia produtiva do café com a imutabilidade 
              e transparência da tecnologia blockchain.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-10"
            >
              <motion.button 
                ref={magneticButton.ref}
                style={magneticButton.style}
                onMouseMove={magneticButton.onMouseMove}
                onMouseLeave={magneticButton.onMouseLeave}
                onClick={handleGetStarted}
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-amber-500/10 transition-all hover:shadow-amber-500/20"
              >
                <span className="relative flex items-center space-x-2">
                  <span>Começar Agora</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Features Section - Simplificado */}
        <section className="container mx-auto px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-serif text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl"
            >
              Uma Plataforma, Infinitas Garantias
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-lg text-slate-400"
            >
              Para uma cadeia de valor mais justa, transparente e valiosa.
            </motion.p>
          </div>

          {/* Grid Simplificado */}
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            <SimplifiedFeatureCard
              icon={ShieldCheck}
              title="Transparência Imutável"
              description="Cada transação e etapa do processo é registrada de forma segura e permanente na blockchain."
              delay={0.1}
            />
            
            <SimplifiedFeatureCard
              icon={LinkIcon}
              title="Ecossistema Conectado"
              description="Integre produtores, transportadoras, armazéns e torrefadores em uma única plataforma."
              delay={0.2}
            />
            
            <SimplifiedFeatureCard
              icon={Gem}
              title="Valor Agregado"
              description="Certifique a origem e qualidade do seu café, criando uma narrativa poderosa."
              delay={0.3}
            />
          </div>
        </section>

        {/* Image Showcase Section Simplificado */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="font-serif text-3xl font-bold text-center text-slate-100 mb-12"
            >
              Tecnologia que Transforma
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SimpleImage 
                src="/api/placeholder/600/400"
                alt="Blockchain Technology"
                className="rounded-xl"
              />
              <SimpleImage 
                src="/api/placeholder/600/400"
                alt="Coffee Production"
                className="rounded-xl"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-slate-400 text-sm">
            <span>Desenvolvido com</span>
            <Coffee className="h-4 w-4 text-amber-400" />
            <span>para a indústria do café</span>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

// Background Simplificado
const SimplifiedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden opacity-15">
      {/* Blob Principal */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-amber-400/10 to-amber-600/10 rounded-full blur-2xl"
      />
      
      {/* Blob Secundário */}
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute top-3/4 right-1/4 w-64 h-64 bg-gradient-to-r from-amber-300/5 to-amber-500/5 rounded-full blur-2xl"
      />
    </div>
  );
};

// Feature Card Simplificado
const SimplifiedFeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition-all duration-300 hover:bg-white/10"
    >
      <div className="relative z-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-400/10 ring-1 ring-inset ring-amber-400/20">
          <Icon className="h-6 w-6 text-amber-400" />
        </div>
        
        <h3 className="mt-4 font-serif text-lg font-semibold text-slate-100">
          {title}
        </h3>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

// Componente de Imagem Simples
const SimpleImage = ({ src, alt, className }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/20 to-transparent" />
    </div>
  );
};

export default LandingPage;