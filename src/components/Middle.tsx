import { useState } from "react";
import { AdbControl } from "./AdbControl";
import MirrorOptions from "./MirrorOptions";
import PinPad from "./PinPad";
import UtilButton from "./UtilButton";
import { Gamepad2, Cable, Settings2, KeyRound } from "lucide-react";

const tabs = [
  { id: "controls", label: "Controls", icon: Gamepad2 },
  { id: "adb", label: "ADB", icon: Cable },
  { id: "mirror", label: "Mirror", icon: Settings2 },
  { id: "pin", label: "PIN", icon: KeyRound },
];

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
  const [activeTab, setActiveTab] = useState("controls");

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-3 mb-6 bg-[var(--bg-tertiary)] rounded-lg p-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`flex-1 flex items-center h-10 justify-center gap-2! rounded-md text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={20} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 p-4! overflow-auto">
        {activeTab === "controls" && <UtilButton />}
        {activeTab === "adb" && <AdbControl state={{ config, setConfig }} />}
        {activeTab === "mirror" && (
          <MirrorOptions state={{ config, setConfig, mirrorConfig, setMirrorConfig }} />
        )}
        {activeTab === "pin" && <PinPad />}
      </div>
    </div>
  );
}
