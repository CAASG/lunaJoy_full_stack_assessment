/**
 * @module Slider
 * @description Custom range slider for 1-5 scales with labels.
 * Displays the current value label and colored track.
 */

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  labels?: readonly string[];
  label: string;
}

export function Slider({
  value,
  onChange,
  min = 1,
  max = 5,
  labels,
  label,
}: SliderProps) {
  // Defensive: clamp value within bounds
  const clampedValue = Math.max(min, Math.min(max, value));
  const currentLabel = labels?.[clampedValue - min] ?? String(clampedValue);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-luna-dark">{label}</span>
        <span className="text-sm font-medium text-luna-blue-dark px-2 py-0.5 bg-luna-blue-light rounded-full">
          {currentLabel}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={clampedValue}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-luna-cream-dark rounded-lg appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-luna-blue [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:shadow-sm"
        aria-label={label}
      />
      {labels && (
        <div className="flex justify-between text-xs text-luna-warm-gray">
          <span>{labels[0]}</span>
          <span>{labels[labels.length - 1]}</span>
        </div>
      )}
    </div>
  );
}
