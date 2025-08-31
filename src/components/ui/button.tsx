import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({ variant = "primary", children, ...props }) => {
  const base =
    "px-4 py-2 rounded text-sm font-medium transition-colors focus:outline-none";
  const styles =
    variant === "secondary"
      ? "bg-gray-200 text-black hover:bg-gray-300"
      : "bg-blue-600 text-white hover:bg-blue-700";

  return (
    <button className={`${base} ${styles}`} {...props}>
      {children}
    </button>
  );
};
