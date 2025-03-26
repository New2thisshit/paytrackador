
import React from "react";

interface FormFooterProps {
  isSignUp: boolean;
  onSwitchMode: () => void;
}

const FormFooter = ({ isSignUp, onSwitchMode }: FormFooterProps) => {
  return (
    <div className="text-center text-sm">
      {isSignUp ? (
        <p>
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchMode}
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </button>
        </p>
      ) : (
        <p>
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchMode}
            className="text-primary hover:underline font-medium"
          >
            Create account
          </button>
        </p>
      )}
    </div>
  );
};

export default FormFooter;
