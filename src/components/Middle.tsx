import { useState } from "react";
import { AdbControl } from "./AdbControl";
import MirrorOptions from "./MirrorOptions";
import PinPad from "./PinPad";
import UtilButton from "./UtilButton";

export default function Middle() {
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
    
          <div className="options flex gap-2 flex-row">
            <div className="w-3/8 flex justify-center gap-2 align-center flex-col">
              <div className="flex-auto h-full border-2 border-white ">
                <UtilButton />
              </div>
              <div className="flex-auto h-full justify-center flex-col border-2 border-white">
                <AdbControl state={{ config, setConfig }} />
              </div>
            </div>
            
            <div className="flex flex-col h-full justify-around items-center flex-1 border-2 border-white">
              <PinPad />
              <MirrorOptions state={{ config, setConfig, mirrorConfig, setMirrorConfig }} />
            </div>
          </div>
  );
}