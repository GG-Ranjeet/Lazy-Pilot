interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  showStep?: boolean;
  stepCount?: number;
}

export default function Slider({
  value,
  onChange,
  showStep = false,
  stepCount = 1,
}: SliderProps) {
  return (
    <div className="w-full">
      <input
        type="range"
        min={0}
        max={stepCount}
        value={value}
        className="range-slider"
        step={1}
        onChange={(e) => onChange(parseInt(e.target.value))}
      />
      {showStep && (
        <div className="flex justify-between px-1 mt-1 text-[10px] text-[var(--text-muted)]">
          {Array.from({ length: stepCount + 1 }).map((_, i) => (
            <span key={i}>{i}</span>
          ))}
        </div>
      )}
    </div>
  );
}
