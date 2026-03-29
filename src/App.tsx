import "./App.css";
import PinPad from "./components/PinPad";
import UtilButton from "./components/UtilButton";
import Header from "./components/Header";
import Browser from "./components/Browser";
import { AdbControl } from "./components/AdbControl";
import MirrorOptions from "./components/MirrorOptions";

function App() {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-col" id="header">
        <Header />
      </div>
      <div className="flex flex-1 gap-2 overflow-hidden">
        <div className="w-1/4">
          <Browser />
        </div>
        <div className="w-1/4 flex justify-center align-center flex-col">
          <div className="flex-auto border-2 border-black bg-gray-50">
            <UtilButton />
          </div>
          <div className="flex-auto justify-center flex-col">
            <AdbControl />
          </div>
        </div>
        <div className="flex flex-col justify-around items-center flex-1">
          <PinPad />
          <MirrorOptions />
        </div>
      </div>
    </div>
  );
}

export default App;
