// components/ActionTile.tsx
"use client";

import { ButtonHTMLAttributes } from "react";

/**
 * WHY: Reusable, accessible tile that looks like your green card.
 */
export function ActionTile({
  title,
  className = "",
  ...props
}: {
  title: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`group relative w-full h-56 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700
        bg-green-600 text-black text-left p-8 transition-transform hover:-translate-y-0.5 active:translate-y-0 ${className}`}
      {...props}
    >
      <span className="block text-3xl md:text-4xl font-semibold leading-tight">
        {title}
      </span>

      {/* Arrow */}
      <span
        aria-hidden
        className="absolute right-8 bottom-8 inline-flex items-center gap-2 text-black/90"
      >
        <span className="pi pi-arrow-right text-2xl transform transition-transform group-hover:translate-x-2" />
      </span>
    </button>
  );
}
