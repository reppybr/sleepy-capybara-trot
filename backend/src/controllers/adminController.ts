import { Request, Response } from 'express';
import { supabase } from '../config/supabase'; // Importa a instância do Supabase com Service Role Key

export const assignBrandOwnerRole = async (req: Request, res: Response) => {
  const { identifier, method } = req.body; // 'identifier' pode ser email ou public_key, 'method' indica qual

  if (!identifier || !method) {
    return res.status(400).json({ error: 'Identifier and method are required.' });
  }

  let userToUpdate;
  let fetchError;

  try {
    if (method === 'email') {
      const { data, error } = await supabase
        .from('users')
        .select('auth_user_id, email')
        .eq('email', identifier)
        .single();
      userToUpdate = data;
      fetchError = error;
    } else if (method === 'publicKey') {
      const { data, error } = await supabase
        .from('users')
        .select('auth_user_id, public_key')
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

    // Update the user's role to 'brand_owner' and set is_profile_complete to false
    const { error: updateError } = await supabase
      .from('users')
      .update({ role: 'brand_owner', is_profile_complete: false })
      .eq('auth_user_id', userToUpdate.auth_user_id);

    if (updateError) {
      throw updateError;
    }

    return res.status(200).json({ message: `User ${identifier} is now a Brand Owner!` });

  } catch (error: any) {
    console.error('Error assigning Brand Owner role:', error);
    return res.status(500).json({ error: 'Internal server error during role assignment.', details: error.message });
  }
};