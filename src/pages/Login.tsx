import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, User, Mail, KeyRound, ArrowRight, Factory, Users } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import coffeeImage from '@/assets/placeholder.svg';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { session, loading, profile } = useSupabaseAuth();

  useEffect(() => {
    if (!loading && session && profile) {
      if (profile.is_profile_complete) {
        // Case 3: Profile is complete, redirect based on role
        if (profile.role === 'brand_owner') {
          navigate('/dashboard');
        } else {
          navigate('/tasks');
        }
      } else if (profile.role) {
        // Case 2: Role is assigned but profile is incomplete, redirect to complete profile
        navigate('/register-enterprise');
      }
      // Case 1: Role is NOT assigned and profile is incomplete, stay on login to show instructions
    }
  }, [session, loading, profile, navigate]);

  const truncatePublicKey = (key: string) => {
    if (!key) return 'N/A';
    return `${key.substring(0, 6)}...${key.substring(key.length - 4)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p>Carregando sessão...</p>
      </div>
    );
  }

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
            
            {session && profile && !profile.is_profile_complete && !profile.role ? (
              // Case 1: User logged in, but no role assigned and profile incomplete
              <div className="space-y-6 w-full">
                <p className="text-lg text-muted-foreground">
                  Seu acesso ao sistema está pendente.
                </p>
                <div className="text-left space-y-4 w-full">
                  <h2 className="text-xl font-semibold text-primary-foreground flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" /> Suas Informações
                  </h2>
                  <div className="space-y-2 text-muted-foreground pl-2">
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" /> Email: <span className="font-semibold text-primary-foreground">{profile.email}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4 text-primary" /> Chave Pública: <span className="font-mono text-sm text-primary-foreground">{truncatePublicKey(profile.public_key)}</span>
                    </p>
                  </div>

                  <h2 className="text-xl font-semibold text-primary-foreground flex items-center gap-2 mt-6">
                    <Users className="h-5 w-5 text-primary" /> Próximos Passos
                  </h2>
                  <div className="space-y-2 text-muted-foreground pl-2">
                    <p>
                      Para ter acesso ao sistema, por favor, envie seu **Email** e **Chave Pública** para um administrador do sistema ou um "Dono de Marca" parceiro. Eles irão atribuir seu papel e liberar seu acesso.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Default: Show Auth UI (if no session or profile is complete and redirected)
              <>
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
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;