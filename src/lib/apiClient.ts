import { supabase } from '@/integrations/supabase/client';

const API_BASE_URL = 'https://sleepy-capybara-trot.onrender.com/api';

// A generic API client function to handle requests
async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Get the session from Supabase to retrieve the JWT
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    // Use the error message from the backend, or a default one
    throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
  }

  // Handle responses with no content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export default apiClient;