"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { toast } from 'sonner';
import { Lock, User, Mail, PlusCircle, LogIn } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [brandOwnerEmail, setBrandOwnerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setIsAdminLoggedIn(true);
      toast.success("Login de administrador bem-sucedido!");
    } else {
      toast.error("Credenciais de administrador inválidas.");
    }
  };

  const handleAddBrandOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandOwnerEmail.trim() || !/\S+@\S+\.\S+/.test(brandOwnerEmail)) {
      toast.error("Por favor, insira um email válido.");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Atribuindo papel de Brand Owner...", { id: "add-brand-owner" });

    try {
      // 1. Find the user in the public.users table by email
      const { data: existingUsers, error: fetchError } = await supabase
        .from('users')
        .select('auth_user_id, email')
        .eq('email', brandOwnerEmail);

      if (fetchError) {
        throw fetchError;
      }

      if (!existingUsers || existingUsers.length === 0) {
        toast.error("Usuário não encontrado. Certifique-se de que o usuário já se registrou no sistema.", { id: "add-brand-owner" });
        return;
      }

      const userToUpdate = existingUsers[0];

      // 2. Update the user's role to 'brand_owner' and set is_profile_complete to false
      const { error: updateError } = await supabase
        .from('users')
        .update({ role: 'brand_owner', is_profile_complete: false })
        .eq('auth_user_id', userToUpdate.auth_user_id);

      if (updateError) {
        throw updateError;
      }

      toast.success(`O usuário ${brandOwnerEmail} agora é um Brand Owner!`, { id: "add-brand-owner" });
      setBrandOwnerEmail(''); // Clear the input
    } catch (error: any) {
      toast.error(error.message || "Falha ao atribuir o papel. Tente novamente.", { id: "add-brand-owner" });
      console.error("Error adding brand owner:", error);
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

        <form onSubmit={handleAddBrandOwner} className="space-y-6">
          <h2 className="text-xl font-semibold text-primary-foreground flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-primary" /> Atribuir Papel de Brand Owner
          </h2>
          <p className="text-muted-foreground text-sm">
            Insira o email de um usuário existente para atribuir a ele o papel de "Brand Owner".
            O usuário precisará fazer login novamente para que a mudança seja aplicada.
          </p>
          <div className="grid gap-2">
            <Label htmlFor="brandOwnerEmail">Email do Usuário</Label>
            <Input
              id="brandOwnerEmail"
              type="email"
              value={brandOwnerEmail}
              onChange={(e) => setBrandOwnerEmail(e.target.value)}
              placeholder="email@exemplo.com"
              className="bg-slate-700 border-slate-600 text-primary-foreground"
              required
            />
          </div>
          <Button type="submit" variant="primary" className="w-full flex items-center gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Atribuindo...</span>
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" /> Atribuir Brand Owner
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Admin;