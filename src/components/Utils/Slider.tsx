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
    <div className="w-full max-w-xs">
      <input
        type="range"
        min={0}
        max={stepCount}
        value={value}
        className="range"
        step={1}
        onChange={(e) => onChange(parseInt(e.target.value))}
      />
      {showStep && (
        <div className="flex justify-between px-2.5 mt-2 mb-2 text-xs">
          {Array.from({ length: stepCount + 1 }).map((_, i) => (
            <span key={i}>|</span>
          ))}
        </div>
      )}
    </div>
  );
}
