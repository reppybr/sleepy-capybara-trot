import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { PartnerRoleKey } from '../types/forms'; // Importar o tipo de role

// Assumindo que o req.user é populado por um middleware de autenticação
interface AuthenticatedRequest extends Request {
  user?: {
    auth_user_id: string;
    public_key: string;
    role: PartnerRoleKey;
    email: string;
    name: string;
  };
}

export const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  const { publicKey } = req.params;

  try {
    const { data: userProfile, error } = await supabase
      .from('users')
      .select('public_key, name, email, role, is_profile_complete, profile_metadata')
      .eq('public_key', publicKey)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return res.status(404).json({ error: 'User profile not found.' });
      }
      throw error;
    }

    return res.status(200).json(userProfile);
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ error: 'Internal server error.', details: error.message });
  }
};

export const updateMyProfile = async (req: AuthenticatedRequest, res: Response) => {
  const { public_key: userPublicKey } = req.user!; // Assumindo que o usuário está autenticado
  const { name, email, role, profile_metadata } = req.body;

  try {
    const { data, error } = await supabase
      .from('users')
      .update({ name, email, role, profile_metadata })
      .eq('public_key', userPublicKey)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({ message: 'Profile updated successfully.', user: data });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ error: 'Internal server error.', details: error.message });
  }
};

export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  // Apenas administradores ou Brand Owners podem ver todos os usuários
  if (req.user?.role !== 'brand_owner' && req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Only Brand Owners or Admins can view all users.' });
  }

  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('auth_user_id, public_key, name, email, role, is_profile_complete');

    if (error) {
      throw error;
    }

    return res.status(200).json(users);
  } catch (error: any) {
    console.error('Error fetching all users:', error);
    return res.status(500).json({ error: 'Internal server error.', details: error.message });
  }
};