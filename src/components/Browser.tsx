import { Smartphone, Wifi, WifiOff, Battery, Cpu } from "lucide-react";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function Browser() {
  const [deviceInfo, setDeviceInfo] = useState({
    model: "Unknown",
    connected: false,
    battery: "--",
  });

  async function checkDevice() {
    try {
      const devices: string = await invoke("get_devices");
      const lines = devices.trim().split("\n");
      const connected = lines.some((line) => line.includes("device") && !line.includes("List"));
      setDeviceInfo((prev) => ({ ...prev, connected }));
    } catch {
      setDeviceInfo((prev) => ({ ...prev, connected: false }));
    }
  }

  return (
    <div className="section">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-bg)] border border-[var(--border-color)]">
          <Smartphone size={22} className="text-[var(--accent)]" />
        </div>
        <div>
          <div className="text-sm font-semibold">{deviceInfo.model}</div>
          <div className={`badge ${deviceInfo.connected ? "badge-success" : "badge-warning"}`}>
            <span className="badge-dot" />
            {deviceInfo.connected ? "Connected" : "Disconnected"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 p-3! rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
          {deviceInfo.connected ? <Wifi size={16} className="text-[var(--success)]" /> : <WifiOff size={16} className="text-[var(--text-muted)]" />}
          <span className="text-xs text-[var(--text-secondary)]">ADB</span>
        </div>
        <div className="flex items-center gap-2 p-3! rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
          <Battery size={16} className="text-[var(--text-muted)]" />
          <span className="text-xs text-[var(--text-secondary)]">{deviceInfo.battery}</span>
        </div>
      </div>

      <button className="btn btn-primary" style={{ width: "100%" }} onClick={checkDevice}>
        <Cpu size={14} />
        Check Device
      </button>
    </div>
  );
}
