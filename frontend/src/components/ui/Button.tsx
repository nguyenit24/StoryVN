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
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 select-none focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs sm:text-sm";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-xs sm:text-sm font-semibold",
    lg: "px-6 py-3 text-sm font-bold",
  };

  const variantStyles = {
    primary:
      "bg-[#1d72fe] text-white hover:bg-blue-600 active:bg-blue-700 border border-transparent focus:ring-blue-400 shadow-sm shadow-blue-500/25",
    secondary:
      "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 active:bg-slate-300 focus:ring-slate-400",
    outline:
      "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 focus:ring-blue-400",
    danger:
      "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 border border-red-500 focus:ring-red-400",
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
