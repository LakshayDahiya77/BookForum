"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type DropdownProps = {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
  menuClassName?: string;
};

export default function Dropdown({
  trigger,
  children,
  align = "right",
  className = "",
  menuClassName = "w-48",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleLinkClick = (e: React.MouseEvent) => {
    // Close on navigation or explicit menu items, but keep form buttons alive so
    // server actions can submit before the dropdown unmounts.
    if ((e.target as HTMLElement).closest("a, [role='menuitem']")) {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div
          onClick={handleLinkClick}
          className={`absolute top-full mt-2 rounded-lg border border-border bg-surface p-2 shadow-lg z-50 ${
            align === "right" ? "right-0" : "left-0"
          } ${menuClassName}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// Helper components to style items consistently
export function DropdownItem({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div
      role="menuitem"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm text-text-primary hover:bg-background transition-colors cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
}
