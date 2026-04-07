interface ToggleProps {
  mark: boolean;
  default_check?: boolean;
  handler?: (checked: boolean) => void;
}

export default function Toggle({
  mark = false,
  default_check = false,
  handler = undefined,
}: ToggleProps) {
  if (!mark) {
    return (
      <label className="toggle">
        <input
          type="checkbox"
          defaultChecked={default_check}
          onChange={(e) => handler && handler(e.target.checked)}
        />
        <span className="toggle-track" />
        <span className="toggle-thumb" />
      </label>
    );
  }
  return (
    <label className="toggle">
      <input type="checkbox" defaultChecked={default_check} onChange={(e) => handler && handler(e.target.checked)} />
      <span className="toggle-track" />
      <span className="toggle-thumb" />
    </label>
  );
}
