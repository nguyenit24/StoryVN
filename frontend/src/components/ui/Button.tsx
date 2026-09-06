import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-none transition-all duration-150 select-none focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider text-xs";

  const sizeStyles = {
    sm: "px-3 py-2 text-xs",
    md: "px-5 py-3 text-xs font-semibold",
    lg: "px-6 py-3.5 text-sm font-semibold",
  };

  const variantStyles = {
    primary:
      "bg-zinc-950 text-white hover:bg-black active:bg-zinc-800 border border-zinc-950 focus:ring-zinc-900 shadow-sm",
    secondary:
      "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-zinc-200 active:bg-zinc-300 focus:ring-zinc-400",
    outline:
      "bg-white text-zinc-900 border border-zinc-300 hover:bg-zinc-50 hover:border-zinc-900 active:bg-zinc-100 focus:ring-zinc-900",
    danger:
      "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border border-red-600 focus:ring-red-500",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? "w-full" : ""
        } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>ĐANG XỬ LÝ...</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          {leftIcon && <span className="inline-flex">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="inline-flex">{rightIcon}</span>}
        </span>
      )}
    </button>
  );
};
