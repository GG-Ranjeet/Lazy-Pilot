import "./App.css";
import PinPad from "./components/PinPad";
import UtilButton from "./components/UtilButton";
import Header from "./components/Header";
import Browser from "./components/Browser";
import { AdbControl } from "./components/AdbControl";
import MirrorOptions from "./components/MirrorOptions";
import { useState } from "react";

function App() {
  const [config, setConfig] = useState({
    binary_path: "D:\\project\\tauri\\myTauriApp\\scrcpy",
    gateway: null as string | null,
  });
  const [mirrorConfig, setMirrorConfig] = useState({
    alwaysOnTop: true,
    audioForwarding: false,
    videoEnabled: true,
    showWindow: true,
    screenOn: false,
  });
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

        {/* middle */}
        <div className="w-1/3 flex justify-center gap-2 align-center flex-col">
          <div className="flex-auto border-2 border-white ">
            <UtilButton />
          </div>
          <div className="flex-auto justify-center flex-col border-2 border-white">
            <AdbControl state={{ config, setConfig }} />
          </div>
        </div>

        {/* right */}
        <div className="flex flex-col justify-around items-center flex-1 border-2 border-white">
          <PinPad />
          <MirrorOptions state={{ config, setConfig, mirrorConfig, setMirrorConfig }} />
        </div>
      </div>
    </div>
  );
}

export default App;
