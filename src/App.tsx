import "./App.css";
import Header from "./components/Header";
import Browser from "./components/Browser";
import Middle from "./components/Middle";
import Console from "./components/Console";

function App() {
  return (
    <div className="flex h-screen flex-col gap-2">
      <div className="flex flex-col border-2 border-white" id="header">
        <Header />
      </div>
      <div className="flex flex-1 gap-2 overflow-hidden">
        {/* left */}
        <div className="w-1/4 border-2 border-white">
          <Browser />
        </div>

        {/* right */}
        <div className="flex w-3/4 flex-col ">
          <div className="flex flex-col ">
            <Middle></Middle>
          </div>
          <div className="console w-full h-1/3 flex flex-col">
            <div className="flex-auto border-2 border-white">
              <Console />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
