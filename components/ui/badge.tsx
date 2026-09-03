import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "sage"
    | "terracotta"
    | "outline"
    | "secondary"
    | "muted";
  size?: "sm" | "md" | "lg";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}) => {
  const variantStyles: Record<string, string> = {
    default: "bg-[#171714] text-[#F7F3EC]",
    sage: "bg-[#8A9B84]/15 text-[#54684E] border border-[#8A9B84]/30",
    terracotta: "bg-[#B76546]/15 text-[#B76546] border border-[#B76546]/30",
    outline: "border border-[#DCD5C9] text-[#171714] bg-transparent",
    secondary: "bg-[#EDE7DE] text-[#171714]",
    muted: "bg-[#EDE7DE] text-[#6E6A61]",
  };

  const sizeStyles: Record<string, string> = {
    sm: "text-[9px] px-2 py-0.5",
    md: "text-[10px] px-2.5 py-1",
    lg: "text-xs px-3 py-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-sans uppercase font-semibold tracking-widest rounded-full transition-colors",
        variantStyles[variant] || variantStyles.default,
        sizeStyles[size] || sizeStyles.md,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
