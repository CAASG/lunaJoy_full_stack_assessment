/**
 * @module ParameterSelector
 * @description Allows users to select exactly 3 chart parameters to display.
 * Each parameter is a toggleable chip with the parameter's color indicator.
 */

import { CHART_PARAMETERS } from '../../utils/constants';
import type { ChartParameter } from '../../types';

interface ParameterSelectorProps {
  selected: ChartParameter[];
  onChange: (selected: ChartParameter[]) => void;
}

const ALL_PARAMS = Object.keys(CHART_PARAMETERS) as ChartParameter[];

export function ParameterSelector({ selected, onChange }: ParameterSelectorProps) {
  const toggleParam = (param: ChartParameter) => {
    if (selected.includes(param)) {
      // Always keep at least 1 selected
      if (selected.length > 1) {
        onChange(selected.filter((p) => p !== param));
      }
    } else if (selected.length < 3) {
      onChange([...selected, param]);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-luna-warm-gray">
        Select up to 3 parameters to display ({selected.length}/3)
      </p>
      <div className="flex flex-wrap gap-2">
        {ALL_PARAMS.map((param) => {
          const config = CHART_PARAMETERS[param];
          const isSelected = selected.includes(param);
          const isDisabled = !isSelected && selected.length >= 3;

          return (
            <button
              key={param}
              type="button"
              onClick={() => toggleParam(param)}
              disabled={isDisabled}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                transition-all duration-200
                ${
                  isSelected
                    ? 'bg-luna-blue-light text-luna-dark ring-1 ring-luna-blue'
                    : isDisabled
                      ? 'bg-luna-cream-dark text-luna-warm-gray opacity-50 cursor-not-allowed'
                      : 'bg-luna-cream-dark text-luna-warm-gray hover:bg-luna-cream'
                }
              `}
              aria-pressed={isSelected}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              {config.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
