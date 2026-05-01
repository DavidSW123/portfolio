"use client";
import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "ghost" | "link" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", loading, children, disabled, style, ...props }, ref) => {
    const sizeClasses = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-8 px-3 text-xs",
      lg: "h-11 px-8 text-base",
      icon: "h-10 w-10",
    };

    const variantStyles: Record<string, React.CSSProperties> = {
      default: {
        background: "var(--accent)",
        color: "var(--accent-fg)",
      },
      destructive: {
        background: "var(--destructive)",
        color: "#fff",
      },
      outline: {
        background: "transparent",
        color: "var(--text)",
        border: "1px solid var(--border)",
      },
      ghost: {
        background: "transparent",
        color: "var(--text-muted)",
      },
      link: {
        background: "transparent",
        color: "var(--accent)",
        textDecoration: "underline",
      },
      secondary: {
        background: "var(--bg-surface-2)",
        color: "var(--text)",
        border: "1px solid var(--border)",
      },
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          sizeClasses[size],
          className
        )}
        style={{ ...variantStyles[variant], ...style }}
        {...props}
      >
        {loading && (
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export { Button };
