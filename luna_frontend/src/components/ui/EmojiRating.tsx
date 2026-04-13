/**
 * @module EmojiRating
 * @description Interactive emoji-based mood selector for the 1-5 scale.
 * Each emoji represents a mood level from very sad to very happy.
 * Uses accessible button elements with clear visual feedback.
 */

interface EmojiRatingProps {
  value: number;
  onChange: (value: number) => void;
}

const EMOJIS = [
  { emoji: '😢', label: 'Very Sad', value: 1 },
  { emoji: '😟', label: 'Sad', value: 2 },
  { emoji: '😐', label: 'Neutral', value: 3 },
  { emoji: '🙂', label: 'Happy', value: 4 },
  { emoji: '😊', label: 'Very Happy', value: 5 },
] as const;

export function EmojiRating({ value, onChange }: EmojiRatingProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      {EMOJIS.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={`
            flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200
            ${
              value === item.value
                ? 'bg-luna-blue-light scale-110 shadow-sm ring-2 ring-luna-blue'
                : 'bg-luna-cream-dark hover:bg-luna-cream hover:scale-105'
            }
          `}
          aria-label={item.label}
          aria-pressed={value === item.value}
        >
          <span className="text-3xl" role="img" aria-hidden="true">
            {item.emoji}
          </span>
          <span className="text-xs text-luna-warm-gray">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
