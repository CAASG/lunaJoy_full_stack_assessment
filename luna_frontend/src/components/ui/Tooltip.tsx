/**
 * @module Tooltip
 * @description Accessible tooltip component using CSS-only approach.
 * Shows helpful context on hover/focus for form fields and chart elements.
 * Uses a calming visual style consistent with the LunaJoy palette.
 */

import type { ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom';
}

/**
 * Wraps children with a hover/focus tooltip.
 * Uses group + invisible/visible pattern for CSS-only tooltips (no JS state).
 */
export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const positionClasses =
    position === 'top'
      ? 'bottom-full left-1/2 -translate-x-1/2 mb-2'
      : 'top-full left-1/2 -translate-x-1/2 mt-2';

  const arrowClasses =
    position === 'top'
      ? 'top-full left-1/2 -translate-x-1/2 border-t-luna-dark'
      : 'bottom-full left-1/2 -translate-x-1/2 border-b-luna-dark';

  return (
    <div className="relative inline-flex group">
      {children}
      <div
        role="tooltip"
        className={`
          absolute ${positionClasses} z-50 px-3 py-2 text-xs text-white bg-luna-dark
          rounded-lg shadow-lg whitespace-normal max-w-[220px] text-center
          invisible opacity-0 group-hover:visible group-hover:opacity-100
          group-focus-within:visible group-focus-within:opacity-100
          transition-opacity duration-200 pointer-events-none
        `}
      >
        {content}
        <div
          className={`absolute ${arrowClasses} w-0 h-0 border-4 border-transparent`}
        />
      </div>
    </div>
  );
}

/**
 * Small info icon that triggers a tooltip on hover.
 * Use next to form labels for contextual help.
 */
export function InfoTooltip({ content }: { content: string }) {
  return (
    <Tooltip content={content}>
      <span
        className="inline-flex items-center justify-center w-4 h-4 rounded-full
          bg-luna-cream-dark text-luna-warm-gray text-[10px] font-bold cursor-help
          hover:bg-luna-blue-light hover:text-luna-blue-dark transition-colors"
        aria-label="More information"
        tabIndex={0}
      >
        ?
      </span>
    </Tooltip>
  );
}
