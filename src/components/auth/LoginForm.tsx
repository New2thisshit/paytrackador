
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BuildingIcon } from "./CustomIcons";
import SignInForm, { loginSchema, LoginFormValues } from "./SignInForm";
import SignUpForm, { signupSchema, SignupFormValues } from "./SignUpForm";
import SocialLoginButtons from "./SocialLoginButtons";
import FormFooter from "./FormFooter";

const LoginForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, loading, signInWithSocialProvider } = useAuth();
  const { toast } = useToast();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignIn = async (values: LoginFormValues) => {
    try {
      await signIn(values.email, values.password);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSignUp = async (values: SignupFormValues) => {
    try {
      await signUp(values.email, values.password);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'apple') => {
    try {
      await signInWithSocialProvider(provider);
    } catch (error: any) {
      console.error("Social sign in error:", error);
    }
  };

  const switchFormMode = () => {
    setIsSignUp(!isSignUp);
    // Reset form errors when switching modes
    if (isSignUp) {
      loginForm.reset();
    } else {
      signupForm.reset();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-2">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <BuildingIcon className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">
          {isSignUp ? "Create an account" : "Welcome back"}
        </CardTitle>
        <CardDescription>
          {isSignUp 
            ? "Enter your details to create a new account" 
            : "Enter your credentials to access your account"}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isSignUp ? (
          <SignUpForm 
            form={signupForm} 
            onSubmit={handleSignUp} 
            loading={loading} 
          />
        ) : (
          <SignInForm 
            form={loginForm} 
            onSubmit={handleSignIn} 
            loading={loading} 
          />
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        
        <SocialLoginButtons onSocialSignIn={handleSocialSignIn} />
        
        <FormFooter isSignUp={isSignUp} onSwitchMode={switchFormMode} />
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
