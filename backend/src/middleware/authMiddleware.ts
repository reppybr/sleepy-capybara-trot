import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

// Extend the Express Request interface to include our custom user profile
interface AuthenticatedRequest extends Request {
  user?: any; 
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 1. Verify the token with Supabase Auth to get the authenticated user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authUser) {
      console.error('Auth middleware error (Supabase):', authError?.message);
      return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    }

    // 2. Fetch the full user profile from our public.users table
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', authUser.id)
      .single();

    if (profileError || !userProfile) {
        console.error('Auth middleware error (Profile): User profile not found for auth_user_id', authUser.id);
        return res.status(401).json({ error: 'Unauthorized: User profile not found.' });
    }

    // 3. Attach the full user profile to the request object for use in route handlers
    req.user = userProfile;

    // 4. Proceed to the next middleware or the actual route handler
    next();
  } catch (error: any) {
    console.error('Auth middleware unexpected error:', error.message);
    return res.status(500).json({ error: 'Internal server error during authentication.' });
  }
};