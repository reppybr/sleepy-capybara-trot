import { Request, Response } from 'express';
import { supabase } from '../config/supabase'; // Importa a instância do Supabase com Service Role Key
import { PartnerRoleKey } from '../types/forms';

interface AuthenticatedRequest extends Request {
  user?: {
    auth_user_id: string;
    public_key: string;
    role: PartnerRoleKey;
    email: string;
    name: string;
  };
}

export const assignUserRole = async (req: AuthenticatedRequest, res: Response) => {
  const { identifier, method, role } = req.body;
  const brandOwnerUser = req.user!;

  if (!identifier || !method || !role) {
    return res.status(400).json({ error: 'Identifier, method, and role are required.' });
  }

  let userToUpdate;
  let fetchError;

  try {
    // 1. Find the user in the public.users table
    if (method === 'email') {
      const { data, error } = await supabase
        .from('users')
        .select('auth_user_id, email, public_key, name')
        .eq('email', identifier)
        .single();
      userToUpdate = data;
      fetchError = error;
    } else if (method === 'publicKey') {
      const { data, error } = await supabase
        .from('users')
        .select('auth_user_id, public_key, email, name')
        .eq('public_key', identifier)
        .single();
      userToUpdate = data;
      fetchError = error;
    } else {
      return res.status(400).json({ error: 'Invalid method. Must be "email" or "publicKey".' });
    }

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (!userToUpdate) {
      return res.status(404).json({ error: 'User not found. Please ensure the user has registered in the system.' });
    }

    // 2. Update the user's role and set is_profile_complete to false
    const { error: updateError } = await supabase
      .from('users')
      .update({ role: role, is_profile_complete: false })
      .eq('auth_user_id', userToUpdate.auth_user_id);

    if (updateError) {
      throw updateError;
    }

    // 3. Ensure both Brand Owner and the new partner have profiles in partner_profiles
    const profilesToUpsert = [
      { public_key: brandOwnerUser.public_key, name: brandOwnerUser.name, role: brandOwnerUser.role },
      { public_key: userToUpdate.public_key, name: userToUpdate.name, role: role }
    ];

    const { error: upsertError } = await supabase
      .from('partner_profiles')
      .upsert(profilesToUpsert, { onConflict: 'public_key' });

    if (upsertError) {
      throw upsertError;
    }

    // 4. Automatically create a connection between the Brand Owner and the new partner
    const { error: connectionError } = await supabase
      .from('partner_connections')
      .insert({
        partner_a_key: brandOwnerUser.public_key,
        partner_b_key: userToUpdate.public_key,
        relationship_type: 'brand_partnership',
        status: 'active',
      });

    if (connectionError && connectionError.code !== '23505') { // Ignore if connection already exists
      throw connectionError;
    }

    return res.status(200).json({ 
      message: `User ${identifier} is now a ${role} and connected to your network!`,
      user: {
        id: userToUpdate.auth_user_id,
        name: userToUpdate.name,
        email: userToUpdate.email,
        public_key: userToUpdate.public_key,
        role: role,
      }
    });

  } catch (error: any) {
    console.error('Error assigning user role:', error);
    return res.status(500).json({ error: 'Internal server error during role assignment.', details: error.message });
  }
};