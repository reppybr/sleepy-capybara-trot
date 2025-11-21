import { Request, Response } from 'express';
import { supabase } from '../config/supabase'; // Importa a instância do Supabase com Service Role Key

export const assignUserRole = async (req: Request, res: Response) => {
  const { identifier, method, role } = req.body; // 'identifier' pode ser email ou public_key, 'method' indica qual, 'role' é o papel a ser atribuído

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
        .select('auth_user_id, email, public_key, name') // Select name and public_key too
        .eq('email', identifier)
        .single();
      userToUpdate = data;
      fetchError = error;
    } else if (method === 'publicKey') {
      const { data, error } = await supabase
        .from('users')
        .select('auth_user_id, public_key, email, name') // Select name and email too
        .eq('public_key', identifier)
        .single();
      userToUpdate = data;
      fetchError = error;
    } else {
      return res.status(400).json({ error: 'Invalid method. Must be "email" or "publicKey".' });
    }

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows found
      throw fetchError;
    }

    if (!userToUpdate) {
      return res.status(404).json({ error: 'User not found. Please ensure the user has registered in the system.' });
    }

    // 2. Update the user's role and set is_profile_complete to false
    // This ensures they are prompted to complete their profile for the new role
    const { error: updateError } = await supabase
      .from('users')
      .update({ role: role, is_profile_complete: false })
      .eq('auth_user_id', userToUpdate.auth_user_id);

    if (updateError) {
      throw updateError;
    }

    // Return the updated user data (or relevant parts)
    return res.status(200).json({ 
      message: `User ${identifier} is now a ${role}!`,
      user: {
        id: userToUpdate.auth_user_id, // Use auth_user_id as a unique ID for frontend
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