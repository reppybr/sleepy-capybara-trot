import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee } from 'lucide-react';
import Card from '@/components/common/Card';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import coffeeImage from '@/assets/placeholder.svg';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { session, loading } = useSupabaseAuth();

  useEffect(() => {
    if (!loading && session) {
      // The auth context will handle redirection after sync
      // but we can add a fallback here.
      navigate('/dashboard');
    }
  }, [session, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950 text-white animate-fade-in">
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

      <div className="flex flex-1 lg:w-1/2 items-center justify-center p-4 sm:p-8 lg:p-12">
        <Card className="w-full max-w-lg py-10 px-8 text-center relative overflow-hidden bg-slate-800/70 backdrop-blur-md border-slate-700 shadow-2xl animate-scale-in">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-500/20 to-transparent opacity-30 blur-3xl animate-pulse-slow"></div>

          <div className="flex flex-col items-center space-y-8">
            <Coffee className="h-16 w-16 text-primary animate-bounce-slow" />
            <h1 className="text-4xl font-bold text-primary-foreground">Bem-vindo</h1>
            <p className="text-lg text-muted-foreground">Conecte-se para gerenciar sua cadeia de suprimentos.</p>
            
            <div className="w-full pt-4">
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google']}
                theme="dark"
                localization={{
                  variables: {
                    sign_in: {
                      social_provider_text: 'Entrar com {{provider}}',
                    },
                  },
                }}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;