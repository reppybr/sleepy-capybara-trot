import { supabase } from '../config/supabase.js';

export const getBatchesForUser = async (req, res) => {
  const { public_key: userPublicKey, role: userRole } = req.user;
  const { type } = req.query; // e.g., 'my-batches', 'my-tasks', 'all'

  try {
    let query = supabase
      .from('batches')
      .select(`
        *,
        brand_owner:users!batches_brand_owner_key_fkey(name, role),
        current_holder:users!batches_current_holder_key_fkey(name, role),
        batch_participants (
          *,
          partner:users!batch_participants_partner_public_key_fkey(name, role)
        )
      `);

    // Apply filters based on the 'type' query parameter
    if (type === 'my-batches') {
      // Batches where the user is the brand owner or the current holder
      query = query.or(`brand_owner_key.eq.${userPublicKey},current_holder_key.eq.${userPublicKey}`);
    } else if (type === 'my-tasks') {
      // Batches where the user is a participant but not the current holder
      query = query.neq('current_holder_key', userPublicKey)
                   .eq('batch_participants.partner_public_key', userPublicKey);
    } else if (type === 'all' && userRole === 'admin') {
      // No additional filters for admin fetching all batches
    } else if (userRole !== 'admin') {
        // Default security for non-admins if 'all' is requested or type is invalid
        return res.status(403).json({ error: 'Forbidden: You do not have permission to view all batches.' });
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching batches for user:', error);
      return res.status(500).json({ message: 'Error fetching batches', details: error });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Server error in getBatchesForUser:', error);
    res.status(500).json({ message: 'An unexpected server error occurred.', details: error.message });
  }
};