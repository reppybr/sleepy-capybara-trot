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
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-white">
      {/* Aurora Background Effect */}
      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2">
        <div className="h-[44rem] w-[90rem] bg-[radial-gradient(50%_50%_at_50%_50%,#ca8a04_0%,rgba(202,138,4,0)_100%)] opacity-10" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-slate-950/60 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Coffee className="h-7 w-7 text-amber-400" />
            <span className="text-2xl font-bold text-slate-100">CoffeLedger</span>
          </div>
          <Button 
            onClick={() => navigate('/login')}
            variant="secondary"
            size="sm"
            className="hidden sm:flex"
          >
            Login
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto flex flex-col items-center px-4 py-24 text-center sm:py-32">
          <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-400 sm:text-6xl lg:text-7xl">
            A Rastreabilidade do Café, Reinventada
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Conecte, rastreie e certifique cada etapa da cadeia produtiva do café com a imutabilidade e transparência da tecnologia blockchain.
          </p>
          <div className="mt-10">
            <Button 
              onClick={handleGetStarted}
              className="px-8 py-4 text-lg font-semibold flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/40"
              variant="primary"
            >
              <span>Começar Agora</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">Por que CoffeLedger?</h2>
            <p className="mt-4 text-lg text-slate-400">
              Uma plataforma única para uma cadeia de valor mais justa e transparente.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <FeatureCard
              icon={ShieldCheck}
              title="Transparência Imutável"
              description="Cada transação e etapa do processo é registrada de forma segura e permanente na blockchain, eliminando fraudes e garantindo a autenticidade."
            />
            <FeatureCard
              icon={LinkIcon}
              title="Ecossistema Conectado"
              description="Integre produtores, transportadoras, armazéns e torrefadores em uma única plataforma, otimizando a comunicação e a eficiência operacional."
            />
            <FeatureCard
              icon={Gem}
              title="Valor Agregado e Qualidade"
              description="Certifique a origem, o processo e a qualidade do seu café, criando uma narrativa poderosa para o consumidor final e valorizando seu produto."
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
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
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md transition-transform hover:-translate-y-1">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-amber-400/10">
      <Icon className="h-6 w-6 text-amber-400" />
    </div>
    <h3 className="mt-6 font-semibold text-slate-100">{title}</h3>
    <p className="mt-4 text-sm text-slate-400">{description}</p>
  </div>
);

export default LandingPage;