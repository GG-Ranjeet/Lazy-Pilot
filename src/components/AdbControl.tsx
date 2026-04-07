import { open } from "@tauri-apps/plugin-dialog";
import { FolderOpen, RefreshCw, Network, Play } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";

export function AdbControl({ state }: any) {
  async function gatewayButton() {
    const output: string = await invoke("get_and_set_gateway");
    state.setConfig((prev: any) => ({ ...prev, gateway: output }));
  }

  async function getDevices() {
    await invoke("get_devices");
  }

  async function setPort() {
    await invoke("set_port", { port: "5555" });
  }

  async function connectAdb() {
    await invoke("connect_adb");
  }

  async function startMirror() {
    const message: string = await invoke("start_mirror", {
      customPath: `${state.config.binary_path}//scrcpy.exe`,
    });
    console.log("Mirror Started, Output:", message);
  }

  async function setPath() {
    try {
      const selected = await open({
        multiple: false,
        directory: true,
        defaultPath: state.config.binary_path || undefined,
      });
      if (selected && typeof selected == "string") {
        state.setConfig((prev: any) => ({ ...prev, binary_path: selected }));
        await invoke("set_binary_path", { path: selected });
      }
    } catch (error) {
      console.error("Error selecting path:", error);
    }
  }

  return (
    <div className="section">
      <div className="section-row">
        <button className="btn" onClick={getDevices}>
          <RefreshCw size={14} />
          Devices
        </button>
        <button className="btn" onClick={setPort}>
          <Network size={14} />
          Set Port
        </button>
      </div>
      <div className="section-row">
        <button className="btn" onClick={connectAdb}>
          Connect ADB
        </button>
        <button className="btn" onClick={gatewayButton}>
          Get Gateway
        </button>
      </div>
      <div className="section-row">
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={startMirror}>
          <Play size={14} />
          Start Mirror
        </button>
        <button className="btn btn-icon" onClick={setPath} title="Set Binary Path">
          <FolderOpen size={16} />
        </button>
      </div>
      {state.config.gateway && (
        <div className="text-xs text-[var(--text-muted)] font-mono">
          Gateway: {state.config.gateway}
        </div>
      )}
    </div>
  );
}
