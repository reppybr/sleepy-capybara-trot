import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, LogIn, Factory, Truck } from 'lucide-react';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext'; // Use new AuthContext
import { useInjectedTask, InjectedTask } from '@/context/InjectedTaskContext'; // Use new InjectedTaskContext
import coffeeImage from '/public/placeholder.svg'; // Using placeholder.svg for coffee image

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { setInjectedTask } = useInjectedTask();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard'); // Or to a default authenticated route
    }
  }, [isAuthenticated, navigate]);

  const handleBrandOwnerLogin = () => {
    toast.loading("Entrando como Dono da Marca...", { id: "login-toast" });
    login('brand_owner');
    setInjectedTask(null); // Clear any injected task for brand owner
    setTimeout(() => {
      toast.success("Login como Dono da Marca realizado com sucesso!", { id: "login-toast" });
      navigate('/dashboard');
    }, 1000);
  };

  const handleLogisticsPartnerLogin = () => {
    toast.loading("Entrando como Operador Logístico...", { id: "login-toast" });
    login('employee_partner');

    // Inject mock batch data for the logistics partner
    const injectedBatchData: InjectedTask = {
      id: 'task-log-001',
      batchId: 'FSC-25-9X7K',
      producer: 'Fazenda Santa Clara',
      arrivalDate: '2025-11-18',
      daysWaiting: 0, // Assuming it just arrived or is current
      status: 'Aguardando Recebimento',
      actionLabel: 'Confirmar Recebimento',
      role: 'Transportadora',
      assignedToPublicKey: 'WORKER-WALLET-456', // Matches the mock user's public_key
    };
    setInjectedTask(injectedBatchData);

    setTimeout(() => {
      toast.success("Login como Operador Logístico realizado com sucesso!", { id: "login-toast" });
      navigate('/tasks');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950 text-white animate-fade-in">
      {/* Left Panel: Image and Overlay Text */}
      <div
        className="relative hidden lg:flex lg:w-1/2 items-center justify-center p-8 bg-cover bg-center"
        style={{ backgroundImage: `url(${coffeeImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
        <div className="relative z-10 text-center space-y-4">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">Rastreabilidade Pura</h1>
          <p className="text-xl text-gray-200 drop-shadow-md">Do grão à xícara, registrado na Blockchain.</p>
        </div>
      </div>

      {/* Right Panel: Login Controls */}
      <div className="flex flex-1 lg:w-1/2 items-center justify-center p-4 sm:p-8 lg:p-12">
        <Card className="w-full max-w-lg py-10 px-8 text-center relative overflow-hidden bg-slate-800/70 backdrop-blur-md border-slate-700 shadow-2xl animate-scale-in">
          {/* Subtle gold/amber glow effect */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-500/20 to-transparent opacity-30 blur-3xl animate-pulse-slow"></div>

          <div className="flex flex-col items-center space-y-8"> {/* Increased space-y from 6 to 8 */}
            <Coffee className="h-16 w-16 text-primary animate-bounce-slow" />
            <h1 className="text-4xl font-bold text-primary-foreground">Bem-vindo de volta</h1>
            <p className="text-lg text-muted-foreground">Conecte-se para gerenciar sua cadeia de suprimentos.</p>

            {/* Connect Wallet (Visual Only) */}
            <Button
              variant="secondary"
              size="lg"
              className="w-full flex items-center justify-center space-x-2 mt-8 bg-slate-700 text-white hover:bg-slate-600 border-slate-600"
              disabled // This button is visual only for now
            >
              <LogIn className="h-5 w-5" />
              <span>Conectar Wallet (Em breve)</span>
            </Button>

            <div className="relative w-full my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-800/70 px-2 text-muted-foreground">OU</span>
              </div>
            </div>

            {/* Demo Mode Section */}
            <div className="w-full space-y-6"> {/* Increased space-y from 4 to 6 */}
              <h2 className="text-xl font-bold text-primary-foreground flex items-center justify-center gap-2">
                ⚡ Acesso Rápido (Modo Demo)
              </h2>
              <p className="text-sm text-muted-foreground">Selecione um perfil para testar a interface:</p>

              <Button
                variant="default" // Amber button
                size="lg"
                className="w-full flex flex-col items-center justify-center space-y-1 py-4 transform transition-transform duration-200 hover:scale-[1.02]"
                onClick={handleBrandOwnerLogin}
              >
                <Factory className="h-5 w-5" />
                <span className="font-bold text-lg">Entrar como Dono da Marca</span>
                <span className="text-[0.7rem] text-primary-foreground/80 text-center px-2">Acesso total, Dashboard Financeiro, Criar Lotes.</span>
              </Button>

              <Button
                variant="secondary" // Blue/Slate button
                size="lg"
                className="w-full flex flex-col items-center justify-center space-y-1 py-4 transform transition-transform duration-200 hover:scale-[1.02]"
                onClick={handleLogisticsPartnerLogin}
              >
                <Truck className="h-5 w-5" />
                <span className="font-bold text-lg">Entrar como Operador Logístico</span>
                <span className="text-[0.7rem] text-muted-foreground text-center px-2">Visão de tarefas, Lote pendente em custódia.</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;