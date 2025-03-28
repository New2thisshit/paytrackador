
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useBankConnections } from "@/hooks/useBankConnections";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LockIcon, ShieldIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const connectionSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type ConnectionFormValues = z.infer<typeof connectionSchema>;

interface BankConnectionFormProps {
  bankId: string;
  bankName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const BankConnectionForm = ({ bankId, bankName, onSuccess, onCancel }: BankConnectionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { connectBank } = useBankConnections();
  const { toast } = useToast();
  
  const form = useForm<ConnectionFormValues>({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  const onSubmit = async (values: ConnectionFormValues) => {
    try {
      setIsSubmitting(true);
      
      const connection = await connectBank(bankId, bankName, {
        username: values.username,
        password: values.password,
      });
      
      if (connection) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center p-2 rounded-md bg-primary/5 border border-primary/10 mb-4">
        <ShieldIcon className="h-5 w-5 text-primary mr-2" />
        <span className="text-sm">
          Your credentials are securely encrypted and never stored on our servers.
        </span>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your bank username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="password" 
                      placeholder="Enter your bank password" 
                      {...field} 
                    />
                    <LockIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </>
              ) : (
                "Connect Bank"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BankConnectionForm;
