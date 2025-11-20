import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { createSolanaWallet } from '../services/WalletService';

export const syncUser = async (req: Request, res: Response) => {
  const { user: authUser } = req.body;

  if (!authUser || !authUser.id) {
    return res.status(400).json({ error: 'User data is missing from the request.' });
  }

  try {
    // 1. Check if user exists in our public 'users' table
    let { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', authUser.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows found
      throw fetchError;
    }

    if (existingUser) {
      // User already exists, just return success
      return res.status(200).json({ message: 'User already synced.', user: existingUser });
    }

    // 2. If user does not exist, create them
    console.log('New user detected. Creating wallet and user record...');
    const { publicKey, encryptedSecretKey } = createSolanaWallet();

    const newUser = {
      auth_user_id: authUser.id,
      email: authUser.email,
      name: authUser.user_metadata?.full_name || authUser.email,
      public_key: publicKey,
      encrypted_private_key: encryptedSecretKey,
      // role: 'brand_owner', // REMOVIDO: O papel será definido posteriormente
      is_profile_complete: false,
    };

    const { data: createdUser, error: insertError } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return res.status(201).json({ message: 'User created and synced successfully.', user: createdUser });

  } catch (error: any) {
    console.error('Error syncing user:', error);
    return res.status(500).json({ error: 'Internal server error during user sync.', details: error.message });
  }
};