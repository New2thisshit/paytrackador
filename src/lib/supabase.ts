
// This file is now deprecated in favor of using the Lovable Supabase integration
// Import the supabase client from '@/integrations/supabase/client' instead
import { supabase } from '@/integrations/supabase/client';
import type { Category, Transaction } from '@/integrations/supabase/client';

export { supabase };
export type { Category, Transaction };

export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type Budget = {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period: 'monthly' | 'yearly';
  created_at: string;
};

export type Account = {
  id: string;
  user_id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  created_at: string;
};
