import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "hero";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const variantStyles: Record<string, string> = {
      primary:
        "bg-[#171714] text-[#F7F3EC] hover:bg-[#2A2925] active:bg-[#11110F] border border-transparent shadow-sm",
      secondary:
        "bg-[#EDE7DE] text-[#171714] hover:bg-[#E2DAD0] active:bg-[#D5CBBE] border border-[#DCD5C9]",
      outline:
        "bg-transparent border border-[#171714] text-[#171714] hover:bg-[#171714]/5 active:bg-[#171714]/10",
      ghost:
        "bg-transparent text-[#171714] hover:bg-[#171714]/5 active:bg-[#171714]/10 border border-transparent",
      danger:
        "bg-[#B76546] text-white hover:bg-[#A3563A] active:bg-[#8F4B32] border border-transparent",
    };

    const sizeStyles: Record<string, string> = {
      sm: "text-xs px-3 py-1.5 min-h-[32px]",
      md: "text-xs uppercase tracking-wider px-4 py-2.5 min-h-[40px]",
      lg: "text-xs uppercase tracking-widest px-6 py-3 min-h-[46px]",
      hero: "text-xs md:text-sm uppercase tracking-widest px-8 py-4 min-h-[52px]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-sans font-medium rounded-[2px] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none",
          variantStyles[variant] || variantStyles.primary,
          sizeStyles[size] || sizeStyles.md,
          className,
        )}
        {...props}
      >
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin mr-2 shrink-0" />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
