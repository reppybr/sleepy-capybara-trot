import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, ArrowRight } from 'lucide-react';
import Button from '@/components/common/Button';
import { MadeWithDyad } from '@/components/made-with-dyad';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Coffee className="h-8 w-8 text-amber-500" />
          <span className="text-2xl font-bold">CoffeLedger</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="max-w-3xl space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
              Rastreabilidade de Café em Blockchain
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto">
              Conecte, rastreie e certifique cada etapa da cadeia produtiva do café com transparência total.
            </p>
          </div>

          <div className="pt-8">
            <Button 
              onClick={handleGetStarted}
              className="px-8 py-4 text-lg flex items-center space-x-2 mx-auto"
              variant="primary"
            >
              <span>Começar Agora</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
              <div className="text-amber-500 mb-3">
                <Coffee className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Transparência Total</h3>
              <p className="text-slate-400">
                Cada etapa da produção registrada de forma imutável na blockchain.
              </p>
            </div>
            
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
              <div className="text-amber-500 mb-3">
                <Coffee className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Conectividade</h3>
              <p className="text-slate-400">
                Integre todos os parceiros da cadeia produtiva em uma única plataforma.
              </p>
            </div>
            
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
              <div className="text-amber-500 mb-3">
                <Coffee className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Qualidade Garantida</h3>
              <p className="text-slate-400">
                Certifique a origem e qualidade do seu café para consumidores finais.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default LandingPage;