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
    <div className="flex flex-col gap-3">
      <div>
        <div className="card-title">Quick Controls</div>
        <UtilButton />
      </div>
      <div>
        <div className="card-title">ADB Connection</div>
        <AdbControl state={{ config, setConfig }} />
      </div>
      <div>
        <div className="card-title">PIN Entry</div>
        <PinPad />
      </div>
      <div>
        <div className="card-title">Mirror Options</div>
        <MirrorOptions state={{ config, setConfig, mirrorConfig, setMirrorConfig }} />
      </div>
    </div>
  );
}
