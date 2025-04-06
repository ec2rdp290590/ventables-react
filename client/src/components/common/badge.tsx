import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "new" | "sale" | "limited";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variantClasses = {
    default: "bg-primary-600 text-white",
    new: "bg-green-600 text-white",
    sale: "bg-secondary-700 text-white",
    limited: "bg-blue-600 text-white"
  };

  return (
    <span 
      className={cn(
        "text-xs font-medium px-2 py-1 rounded",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
