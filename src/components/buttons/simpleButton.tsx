"use client";

import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style of the button
   * - primary: filled blue button (CTAs, forms)
   * - secondary: outlined button (secondary actions)
   * - danger: red button (delete, destructive)
   * - ghost: transparent button (tertiary actions)
   */
  variant?: ButtonVariant;
  /**
   * Size of the button
   */
  size?: ButtonSize;
  /**
   * Whether button is in loading state
   */
  isLoading?: boolean;
  /**
   * Optional icon or content to display before text
   */
  icon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-background hover:bg-accent-hover focus-visible:ring-accent",
  secondary:
    "bg-surface text-text-primary border border-border hover:border-accent hover:text-accent focus-visible:ring-accent",
  danger: "bg-danger text-background hover:opacity-90 focus-visible:ring-danger",
  ghost:
    "bg-transparent text-text-muted hover:text-text-primary hover:bg-surface focus-visible:ring-accent",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm font-medium",
  md: "px-4 py-2 text-base font-medium",
  lg: "px-6 py-3 text-lg font-medium",
};

/**
 * Reusable Button component with support for multiple variants and sizes
 *
 * @example
 * // Primary button
 * <Button>Save</Button>
 *
 * @example
 * // Danger button with custom className
 * <Button variant="danger" onClick={handleDelete}>Delete</Button>
 *
 * @example
 * // Loading state
 * <Button isLoading>Submit</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      icon,
      className,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center rounded-md font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          // Variant styles
          variantClasses[variant],
          // Size styles
          sizeClasses[size],
          // User-provided className (can override above)
          className,
        )}
        {...props}
      >
        {isLoading && (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {icon && !isLoading && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
