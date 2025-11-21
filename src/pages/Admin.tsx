"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { toast } from 'sonner';
import { Lock, User, Mail, PlusCircle, LogIn, Wallet, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [identifier, setIdentifier] = useState(''); // Can be email or public key
  const [addMethod, setAddMethod] = useState<'email' | 'publicKey'>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // This is a mock admin login for demonstration purposes.
    // In a real application, this would involve secure authentication.
    if (username === 'admin' && password === 'admin') {
      setIsAdminLoggedIn(true);
      toast.success("Login de administrador bem-sucedido!");
    } else {
      toast.error("Credenciais de administrador inválidas.");
    }
  };

  const handleAssignBrandOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      toast.error(`Por favor, insira um ${addMethod === 'email' ? 'email' : 'chave pública'} válido.`);
      return;
    }
    if (addMethod === 'email' && !/\S+@\S+\.\S+/.test(identifier)) {
      toast.error("Por favor, insira um email válido.");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Atribuindo papel de Brand Owner...", { id: "assign-role" });

    try {
      const response = await fetch('https://sleepy-capybara-trot.onrender.com/api/admin/assign-brand-owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, method: addMethod }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao atribuir o papel.');
      }

      toast.success(`O usuário ${identifier} agora é um Brand Owner!`, { id: "assign-role" });
      setIdentifier(''); // Clear the input
    } catch (error: any) {
      toast.error(error.message || "Falha ao atribuir o papel. Tente novamente.", { id: "assign-role" });
      console.error("Error assigning brand owner:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary-foreground">
        <Card className="w-full max-w-md p-8 space-y-6 bg-slate-800/70 backdrop-blur-md border-slate-700 shadow-2xl">
          <div className="text-center space-y-4">
            <Lock className="h-12 w-12 text-primary mx-auto" />
            <h1 className="text-3xl font-bold">Acesso Administrativo</h1>
            <p className="text-muted-foreground">Faça login para gerenciar usuários.</p>
          </div>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="bg-slate-700 border-slate-600 text-primary-foreground"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin"
                className="bg-slate-700 border-slate-600 text-primary-foreground"
                required
              />
            </div>
            <Button type="submit" variant="primary" className="w-full flex items-center gap-2">
              <LogIn className="h-4 w-4" /> Entrar
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-primary-foreground p-4">
      <Card className="w-full max-w-lg p-8 space-y-8 bg-slate-800/70 backdrop-blur-md border-slate-700 shadow-2xl">
        <div className="text-center space-y-4">
          <User className="h-12 w-12 text-primary mx-auto" />
          <h1 className="text-3xl font-bold">Painel de Administração</h1>
          <p className="text-muted-foreground">Gerencie os papéis dos usuários na plataforma.</p>
        </div>

        <form onSubmit={handleAssignBrandOwner} className="space-y-6">
          <h2 className="text-xl font-semibold text-primary-foreground flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-primary" /> Atribuir Papel de Brand Owner
          </h2>
          <p className="text-muted-foreground text-sm">
            Insira o identificador de um usuário existente para atribuir a ele o papel de "Brand Owner".
            O usuário precisará fazer login novamente para que a mudança seja aplicada.
          </p>

          <Tabs defaultValue="email" className="w-full" onValueChange={(value) => {
            setAddMethod(value as 'email' | 'publicKey');
            setIdentifier(''); // Clear identifier when switching tabs
          }}>
            <TabsList className="grid w-full grid-cols-2 bg-card border border-border">
              <TabsTrigger value="email" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Mail className="h-4 w-4 mr-2" /> Por Email
              </TabsTrigger>
              <TabsTrigger value="publicKey" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Wallet className="h-4 w-4 mr-2" /> Por Chave Pública
              </TabsTrigger>
            </TabsList>
            <TabsContent value="email" className="mt-4">
              <div className="grid gap-2">
                <Label htmlFor="email-identifier">Email do Usuário</Label>
                <Input
                  id="email-identifier"
                  type="email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="email@exemplo.com"
                  className="bg-slate-700 border-slate-600 text-primary-foreground"
                  required
                />
              </div>
            </TabsContent>
            <TabsContent value="publicKey" className="mt-4">
              <div className="grid gap-2">
                <Label htmlFor="public-key-identifier">Chave Pública do Usuário</Label>
                <Input
                  id="public-key-identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="0x..."
                  className="bg-slate-700 border-slate-600 text-primary-foreground"
                  required
                />
              </div>
            </TabsContent>
          </Tabs>

          <Button type="submit" variant="primary" className="w-full flex items-center gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Atribuindo...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4" /> Atribuir Brand Owner
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Admin;