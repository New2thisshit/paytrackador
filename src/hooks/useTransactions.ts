
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, Transaction } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useTransactions = (userId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch transactions for the current user
  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['transactions', userId],
    queryFn: async (): Promise<Transaction[]> => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  // Add a new transaction
  const addTransaction = useMutation({
    mutationFn: async (newTransaction: Omit<Transaction, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('transactions')
        .insert(newTransaction)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
      toast({
        title: "Transaction added",
        description: "Your transaction has been successfully added.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding transaction",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update an existing transaction
  const updateTransaction = useMutation({
    mutationFn: async ({ id, ...transaction }: Transaction) => {
      const { data, error } = await supabase
        .from('transactions')
        .update(transaction)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
      toast({
        title: "Transaction updated",
        description: "Your transaction has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating transaction",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete a transaction
  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
      toast({
        title: "Transaction deleted",
        description: "Your transaction has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting transaction",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    transactions,
    isLoading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
};
