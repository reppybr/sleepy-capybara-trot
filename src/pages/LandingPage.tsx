'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Coffee, ArrowRight, ShieldCheck, Link as LinkIcon, Gem } from 'lucide-react';

// Hook para Text Scramble
const useScrambleText = (text, speed = 50, enabled = true) => {
  const [displayText, setDisplayText] = useState(enabled ? '' : text);
  
  useEffect(() => {
    if (!enabled) {
      setDisplayText(text);
      return;
    }

    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?~abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let iterations = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
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

        if (iterations >= text.length) {
          clearInterval(interval);
        }
        iterations += 1 / 3;
      }, speed);

      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(timeout);
  }, [text, speed, enabled]);

  return displayText;
};

// Hook para Botão Magnético
const useMagneticButton = (strength = 0.5) => {
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
  const mainRef = useRef(null);

  // Scroll Physics
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const skewY = useTransform(smoothVelocity, [-100, 100], [-2, 2]);

  // Text Scramble
  const scrambledTitle1 = useScrambleText("Rastreabilidade");
  const scrambledTitle2 = useScrambleText("Tátil.");
  const scrambledSubtitle = useScrambleText("A Nova Era do Café");

  // Magnetic Button
  const magneticButton = useMagneticButton(0.3);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
      {/* Liquid Metal Background */}
      <LiquidMetalBackground />

      {/* Background Effects Premium */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />
      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2">
        <div className="h-[44rem] w-[90rem] bg-[radial-gradient(50%_50%_at_50%_50%,#785a28_0%,rgba(120,90,40,0)_100%)] opacity-15" />
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.7%22%20numOctaves%3D%2210%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22%20opacity%3D%220.03%22%2F%3E%3C%2Fsvg%3E')]"></div>

      {/* Spotlight Effect Dinâmico */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 90, 40, 0.15), transparent 80%)`,
        }}
      />

      {/* Moving Borders Background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -inset-[100%] rotate-45 bg-[conic-gradient(from_90deg_at_50%_50%,rgba(120,90,40,0.2)_0%,rgba(255,255,255,0.5)_25%,rgba(120,90,40,0.2)_50%,rgba(255,255,255,0.5)_75%,rgba(120,90,40,0.2)_100%)] animate-[shimmer_4s_linear_infinite]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Coffee className="h-8 w-8 text-amber-400" />
              <div className="absolute inset-0 h-8 w-8 animate-ping-slow rounded-full bg-amber-400/20" />
            </div>
            <span className="text-2xl font-semibold font-serif text-slate-100">CoffeLedger</span>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="hidden sm:flex items-center px-6 py-2 rounded-lg border border-amber-400/50 text-amber-400 hover:bg-amber-400/10 hover:text-amber-300 transition-all duration-300 backdrop-blur-sm"
          >
            Entrar
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main ref={mainRef} className="flex-grow relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto flex min-h-[calc(100vh-5rem)] items-center px-4">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 font-mono text-sm uppercase tracking-widest text-amber-400/80"
            >
              {scrambledSubtitle}
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-serif text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-400 sm:text-7xl lg:text-8xl"
            >
              {scrambledTitle1}
              <span className="block bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                {scrambledTitle2}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6 text-lg leading-8 text-slate-300/90"
            >
              Conecte, rastreie e certifique cada etapa da cadeia produtiva do café com a imutabilidade 
              e transparência da tecnologia blockchain.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-10"
            >
              <motion.button 
                ref={magneticButton.ref}
                style={magneticButton.style}
                onMouseMove={magneticButton.onMouseMove}
                onMouseLeave={magneticButton.onMouseLeave}
                onClick={handleGetStarted}
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-amber-500/20 transition-all hover:shadow-amber-500/40 cursor-magnetic"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="relative flex items-center space-x-2">
                  <span>Começar Agora</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Features Section - Bento Grid Premium */}
        <section className="container mx-auto px-4 py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-serif text-4xl font-bold tracking-tight text-slate-100 sm:text-5xl"
            >
              {useScrambleText("Uma Plataforma, Infinitas Garantias")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-lg text-slate-400"
            >
              Para uma cadeia de valor mais justa, transparente e valiosa.
            </motion.p>
          </div>

          {/* Bento Grid */}
          <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-6 md:grid-rows-2 max-w-6xl mx-auto">
            {/* Card Principal */}
            <FeatureCard
              icon={ShieldCheck}
              title="Transparência Imutável"
              description="Cada transação e etapa do processo é registrada de forma segura e permanente na blockchain, eliminando fraudes e garantindo a autenticidade."
              className="md:col-span-3 md:row-span-2"
              delay={0.1}
            />
            
            {/* Card Médio */}
            <FeatureCard
              icon={LinkIcon}
              title="Ecossistema Conectado"
              description="Integre produtores, transportadoras, armazéns e torrefadores em uma única plataforma, otimizando a comunicação e a eficiência operacional."
              className="md:col-span-3"
              delay={0.3}
            />
            
            {/* Card Pequeno 1 */}
            <FeatureCard
              icon={Gem}
              title="Valor Agregado"
              description="Certifique a origem e qualidade do seu café, criando uma narrativa poderosa para o consumidor final."
              className="md:col-span-2"
              delay={0.5}
            />
            
            {/* Card Pequeno 2 */}
            <FeatureCard
              icon={Coffee}
              title="Origem Premium"
              description="Rastreabilidade completa desde a plantação até a xícara, garantindo autenticidade e qualidade superior."
              className="md:col-span-1"
              delay={0.7}
            />
          </div>
        </section>

        {/* Image Showcase Section with Chromatic Aberration */}
        <section className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="font-serif text-4xl font-bold text-center text-slate-100 mb-16"
            >
              {useScrambleText("Tecnologia que Transforma")}
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ChromaticImage 
                src="/api/placeholder/600/400"
                alt="Blockchain Technology"
                className="rounded-2xl"
              />
              <ChromaticImage 
                src="/api/placeholder/600/400"
                alt="Coffee Production"
                className="rounded-2xl"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-slate-400">
            <span>Desenvolvido com</span>
            <Coffee className="h-4 w-4 text-amber-400" />
            <span>para a indústria do café</span>
          </div>
        </div>
      </footer>

      {/* Estilos CSS para animações customizadas */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }
        @keyframes border-beam {
          0% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        .animate-ping-slow {
          animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .cursor-magnetic {
          cursor: none;
        }
        .cursor-magnetic:hover {
          cursor: pointer;
        }
      `}</style>
    </motion.div>
  );
};

// Componente Liquid Metal Background
const LiquidMetalBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden opacity-20">
      {/* Blob 1 */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-400/20 to-amber-600/20 rounded-full blur-3xl"
      />
      
      {/* Blob 2 */}
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-amber-300/15 to-amber-500/15 rounded-full blur-3xl"
      />
      
      {/* Blob 3 */}
      <motion.div
        animate={{
          x: [0, 120, 0],
          y: [0, 30, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-gradient-to-r from-amber-200/10 to-amber-400/10 rounded-full blur-3xl"
      />
    </div>
  );
};

// Componente FeatureCard com efeitos premium
const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  className,
  delay = 0 
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const cn = (...classes) => classes.filter(Boolean).join(' ');

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl",
        "transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:shadow-amber-500/10",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-amber-400/10 before:via-transparent before:to-transparent before:opacity-0 before:transition-opacity before:duration-500",
        "hover:before:opacity-100",
        className
      )}
      style={{
        backgroundImage: `
          radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 90, 40, 0.15) 0%, transparent 50%)
        `,
      }}
    >
      {/* Moving Border Effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/50 via-amber-200/50 to-amber-400/50 animate-border-beam" />
        <div className="absolute inset-[1px] rounded-2xl bg-gray-950/95 backdrop-blur-xl" />
      </div>

      <div className="relative z-10">
        <div className="relative inline-flex">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-amber-400/10 ring-1 ring-inset ring-amber-400/20 backdrop-blur-sm">
            <Icon className="h-7 w-7 text-amber-400" />
          </div>
          <div className="absolute inset-0 h-14 w-14 rounded-lg bg-amber-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        
        <h3 className="mt-6 font-serif text-xl font-semibold text-slate-100 group-hover:text-amber-50 transition-colors duration-300">
          {title}
        </h3>
        <p className="mt-4 text-base text-slate-400 group-hover:text-slate-300 transition-colors duration-300 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

// Componente Chromatic Aberration
const ChromaticImage = ({ src, alt, className }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Red Channel */}
      <motion.div
        animate={{ x: isHovered ? -2 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute inset-0 z-10 mix-blend-screen opacity-80"
        style={{
          backgroundImage: `url(${src})`,
          filter: 'brightness(1.2) contrast(1.1)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Green Channel - Base */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Blue Channel */}
      <motion.div
        animate={{ x: isHovered ? 2 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute inset-0 z-10 mix-blend-overlay opacity-80"
        style={{
          backgroundImage: `url(${src})`,
          filter: 'brightness(0.9) contrast(1.1)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="relative z-20 bg-transparent w-full h-full flex items-center justify-center">
        <span className="text-transparent">{alt}</span>
      </div>
    </div>
  );
};

export default LandingPage;