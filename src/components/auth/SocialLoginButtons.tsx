
import React from "react";
import { Button } from "@/components/ui/button";
import { GoogleIcon, AppleIcon } from "./CustomIcons";

interface SocialLoginButtonsProps {
  onSocialSignIn: (provider: 'google' | 'apple') => Promise<void>;
}

const SocialLoginButtons = ({ onSocialSignIn }: SocialLoginButtonsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => onSocialSignIn('google')}
        type="button"
      >
        <GoogleIcon className="mr-2 h-4 w-4" />
        Google
      </Button>
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => onSocialSignIn('apple')}
        type="button"
      >
        <AppleIcon className="mr-2 h-4 w-4" />
        Apple
      </Button>
    </div>
  );
};

export default SocialLoginButtons;
