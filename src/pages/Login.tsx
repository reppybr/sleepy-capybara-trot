import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Wallet } from 'lucide-react';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConnectWallet = () => {
    setIsLoading(true);
    toast.loading("Conectando carteira...", { id: "wallet-connect" });

    setTimeout(() => {
      setIsLoading(false);
      toast.success("Carteira conectada com sucesso!", { id: "wallet-connect" });
      navigate('/dashboard');
    }, 1500); // Simulate 1.5 seconds loading
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-black p-4">
      <Card className="w-full max-w-md p-8 text-center relative overflow-hidden bg-slate-800/70 backdrop-blur-md border-slate-700 shadow-2xl">
        {/* Subtle gold/amber glow effect */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-500/20 to-transparent opacity-30 blur-3xl animate-pulse-slow"></div>

        <div className="flex flex-col items-center space-y-6">
          <Coffee className="h-16 w-16 text-primary animate-bounce-slow" />
          <h1 className="text-4xl font-bold text-primary-foreground">Acesse sua conta</h1>
          <p className="text-lg text-muted-foreground">Rastreabilidade transparente para a cadeia do café</p>

          <Button
            variant="primary"
            size="lg"
            className="w-full flex items-center justify-center space-x-2 mt-8"
            onClick={handleConnectWallet}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Conectando...</span>
              </span>
            ) : (
              <>
                <Wallet className="h-5 w-5" />
                <span>Conectar Carteira</span>
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;