import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, User, Mail, KeyRound, ArrowRight, Factory, Users, Clipboard, LogOut, Check } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import coffeeImage from '@/assets/placeholder.svg';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { session, loading, profile, signOut } = useSupabaseAuth();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPublicKey, setCopiedPublicKey] = useState(false);

  useEffect(() => {
    if (!loading && session && profile) {
      if (profile.is_profile_complete) {
        if (profile.role === 'brand_owner') {
          navigate('/dashboard');
        } else {
          navigate('/tasks');
        }
      } else if (profile.role) {
        navigate('/register-enterprise');
      }
    }
  }, [session, loading, profile, navigate]);

  const handleCopy = (text: string, label: string, setCopiedState: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      toast.success(`${label} copiado para a área de transferência!`);
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
    } else {
      // Fallback para ambientes onde a API da área de transferência não está disponível
      toast.error(`Falha ao copiar ${label}. A API da área de transferência não está disponível ou o contexto é inseguro.`);
      console.error("Clipboard API not available. Ensure the page is served over HTTPS or localhost.");
    }
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
              <div className="space-y-6 w-full">
                <p className="text-lg text-muted-foreground">
                  Seu acesso ao sistema está pendente.
                </p>

                <Card className="p-6 space-y-4 bg-slate-800/60 backdrop-blur-md border border-slate-700 text-left">
                  <h2 className="text-xl font-semibold text-primary-foreground flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" /> Suas Informações
                  </h2>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="user-email" className="text-muted-foreground">Email</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="user-email"
                          type="email"
                          value={profile.email}
                          readOnly
                          className="flex-grow bg-slate-700 border-slate-600 text-primary-foreground font-bold"
                        />
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => handleCopy(profile.email, 'Email', setCopiedEmail)}
                          title="Copiar Email"
                          className="transition-all duration-200 active:scale-95"
                        >
                          {copiedEmail ? <Check className="h-4 w-4 text-emerald-500" /> : <Clipboard className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="user-public-key" className="text-muted-foreground">Chave Pública</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="user-public-key"
                          value={profile.public_key}
                          readOnly
                          className="flex-grow bg-slate-700 border-slate-600 text-primary-foreground font-bold font-mono text-sm"
                        />
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => handleCopy(profile.public_key, 'Chave Pública', setCopiedPublicKey)}
                          title="Copiar Chave Pública"
                          className="transition-all duration-200 active:scale-95"
                        >
                          {copiedPublicKey ? <Check className="h-4 w-4 text-emerald-500" /> : <Clipboard className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 space-y-4 bg-slate-800/60 backdrop-blur-md border border-slate-700 text-left">
                  <h2 className="text-xl font-semibold text-primary-foreground flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" /> Próximos Passos
                  </h2>
                  <p className="text-muted-foreground">
                    Para ter acesso ao sistema, por favor, envie seu <strong>Email</strong> e <strong>Chave Pública</strong> para um administrador do sistema ou um "Dono de Marca" parceiro. Eles irão atribuir seu papel e liberar seu acesso.
                  </p>
                </Card>

                <Button variant="danger" onClick={signOut} className="w-full mt-6 flex items-center justify-center space-x-2">
                  <LogOut className="h-4 w-4" />
                  <span>Sair da Conta</span>
                </Button>
              </div>
            ) : (
              <>
                <p className="text-lg text-muted-foreground">Conecte-se para gerenciar sua cadeia de suprimentos.</p>
                <div className="w-full pt-4">
                  <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    providers={['google']}
                    theme="dark"
                    redirectTo={window.location.origin + '/login'}
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