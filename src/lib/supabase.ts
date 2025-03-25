
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we have valid Supabase credentials
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase URL or Anonymous Key is missing. Please set the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
  );
}

// Create the Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  status: 'completed' | 'pending';
  created_at: string;
};

export type Category = {
  id: string;
  user_id: string;
  name: string;
  type: 'income' | 'expense';
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

export type Budget = {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period: 'monthly' | 'yearly';
  created_at: string;
};
