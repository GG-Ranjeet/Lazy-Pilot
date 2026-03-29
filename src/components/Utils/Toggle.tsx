interface ToggleProps {
  mark: boolean;
  default_check?: boolean;
  handler?: (checked: boolean) => void;
}


/** 
 * If check_mark is false, render a regular checkbox. Otherwise, render a toggle with a check mark.
 * default_check is the default checked state of the toggle. It is false by default.
 * handler is a function that is called when the toggle is changed. It receives the new checked state as an argument. It is undefined by default.
 * @param check_mark - false
 * @param default_check - false
 * @param handler - undefined
 * @returns void
 */
export default function Toggle({
  mark = false, 
  default_check = false,
  handler = undefined,
}: ToggleProps) {
  if (!mark) {
    return (
      <div>
          <input
            type="checkbox"
            defaultChecked={default_check}
            className="toggle"
            onChange={(e) => handler && handler(e.target.checked)}
          />
      </div>
    );
  }
  return (
    <label className="toggle text-base-content">
      <input type="checkbox" defaultChecked={default_check} onChange={(e) => handler && handler(e.target.checked)}/>
      <svg
        aria-label="disabled"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
      <svg
        aria-label="enabled"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="4"
          fill="none"
          stroke="currentColor"
        >
          <path d="M20 6 9 17l-5-5"></path>
        </g>
      </svg>
    </label>
  );
}
