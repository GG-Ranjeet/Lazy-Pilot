export default function Browser() {
  return (
    <div>
      <div>
        <h1>Browser</h1>
        <h1>Browser</h1>
        <h1>Browser</h1>
        <h1>Browser</h1>
      </div>
      <div>
        <div className="fab fixed bottom-5 right-5 flex-col-reverse items-center  group-hover:flex">
          {/* a focusable div with tabIndex is necessary to work on all browsers. role="button" is necessary for accessibility */}
          <div
            tabIndex={0}
            role="button"
            className="btn btn-lg btn-circle btn-primary"
          >
            F
          </div>

          {/* buttons that show up when FAB is open */}
          <button className="btn btn-lg btn-circle">A</button>
          <button className="btn btn-lg btn-circle">B</button>
          <button className="btn btn-lg btn-circle">C</button>
        </div>
      </div>
    </div>
  );
}
