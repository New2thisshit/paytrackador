
import React from "react";
import { LucideProps, Apple, Mail, Lock, Key, Building, User, Goal } from "lucide-react";

// Custom icons for social providers
export const GoogleIcon = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={props.size || 24}
    height={props.size || 24}
    {...props}
  >
    <path
      fill="currentColor"
      d="M12 22q-2.05 0-3.875-.788t-3.188-2.15-2.137-3.175T2 12q0-2.075.788-3.887t2.15-3.175 3.175-2.138T12 2q2.075 0 3.887.788t3.175 2.15 2.138 3.175T22 12q0 2.05-.788 3.875t-2.15 3.188-3.175 2.137T12 22Zm0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20Zm-1-3h2V9h-2v8Zm0-10h2V5h-2v2Z"
    />
  </svg>
);

export const AppleIcon = Apple;
export { Mail as MailIcon, Lock as LockIcon, Key as KeyIcon, Building as BuildingIcon, User as UserIcon };
