import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, ArrowRight, ShieldCheck, Link as LinkIcon, Gem } from 'lucide-react';
import Button from '@/components/common/Button';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { cn } from '@/lib/utils';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gray-950 text-white font-sans">
      {/* Background Effects */}
      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2">
        <div className="h-[44rem] w-[90rem] bg-[radial-gradient(50%_50%_at_50%_50%,#785a28_0%,rgba(120,90,40,0)_100%)] opacity-15" />
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.7%22%20numOctaves%3D%2210%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22%20opacity%3D%220.03%22%2F%3E%3C%2Fsvg%3E')]"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gray-950/50 backdrop-blur-lg">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <Coffee className="h-8 w-8 text-amber-400" />
            <span className="text-2xl font-semibold font-serif text-slate-100">CoffeLedger</span>
          </div>
          <Button 
            onClick={() => navigate('/login')}
            variant="secondary"
            className="hidden sm:flex border-amber-400/50 text-amber-400 hover:bg-amber-400/10 hover:text-amber-300"
          >
            Entrar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto flex min-h-[calc(100vh-5rem)] items-center px-4">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-amber-400">A Nova Era do Café</p>
            <h1 className="font-serif text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-400 sm:text-7xl lg:text-8xl">
              Rastreabilidade Tátil.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Conecte, rastreie e certifique cada etapa da cadeia produtiva do café com a imutabilidade e transparência da tecnologia blockchain.
            </p>
            <div className="mt-10">
              <Button 
                onClick={handleGetStarted}
                className="px-8 py-4 text-lg font-semibold flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/40 bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700"
              >
                <span>Começar Agora</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-4xl font-bold tracking-tight text-slate-100 sm:text-5xl">Uma Plataforma, Infinitas Garantias</h2>
            <p className="mt-4 text-lg text-slate-400">
              Para uma cadeia de valor mais justa, transparente e valiosa.
            </p>
          </div>
          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
            <FeatureCard
              icon={ShieldCheck}
              title="Transparência Imutável"
              description="Cada transação e etapa do processo é registrada de forma segura e permanente na blockchain, eliminando fraudes e garantindo a autenticidade."
              className="md:mt-0"
            />
            <FeatureCard
              icon={LinkIcon}
              title="Ecossistema Conectado"
              description="Integre produtores, transportadoras, armazéns e torrefadores em uma única plataforma, otimizando a comunicação e a eficiência operacional."
              className="md:mt-16"
            />
            <FeatureCard
              icon={Gem}
              title="Valor Agregado e Qualidade"
              description="Certifique a origem, o processo e a qualidade do seu café, criando uma narrativa poderosa para o consumidor final e valorizando seu produto."
              className="md:mt-32"
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center">
          <MadeWithDyad />
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, className }) => (
  <div className={cn(
    "rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl transition-all duration-300",
    "hover:bg-white/10 hover:ring-2 hover:ring-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/10",
    className
  )}>
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-amber-400/10 ring-1 ring-inset ring-amber-400/20">
      <Icon className="h-7 w-7 text-amber-400" />
    </div>
    <h3 className="mt-6 font-serif text-xl font-semibold text-slate-100">{title}</h3>
    <p className="mt-4 text-base text-slate-400">{description}</p>
  </div>
);

export default LandingPage;