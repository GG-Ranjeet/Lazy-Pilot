import { open } from "@tauri-apps/plugin-dialog";
import { FolderOpen } from "lucide-react";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export function AdbControl() {
  const [config, setConfig] = useState({
    binary_path: "D:\\project\\tauri\\myTauriApp\\scrcpy",
    gateway: null as string | null,
  });

  var gateway: string = "";

  async function gatewayButton() {
    const output: string = await invoke("get_and_set_gateway");
    gateway = output;
    setConfig((prev) => ({ ...prev, gateway: output }));
    console.log("Default Gateway:", output);
  }
  async function getDevices() {
    const devices: string = await invoke("get_devices");
    console.log("Connected Devices:", devices);
  }
  async function setPort() {
    await invoke("set_port", { port: "5555" });
    console.log("Port set to 5555");
  }
  async function connectAdb() {
    await invoke("connect_adb");
    console.log("Attempting to connect ADB to", gateway);
  }

  async function startMirror() {
    console.log("Starting mirror with gateway:", config.gateway, "and binary path:", `${config.binary_path}//scrcpy.exe`);
    const message: string = await invoke("start_mirror", { customPath: `${config.binary_path}//scrcpy.exe` });
    console.log("Mirror Started, Output:", message);
  }
  async function setPath() {
    try {
      const selected = await open({
        multiple: false,
        directory: true,
        defaultPath: config.binary_path || undefined,
      });
      console.log("Selected path:", selected);
      if (selected && typeof selected == "string") {
        setConfig((prev) => ({ ...prev, binary_path: selected }));
        await invoke("set_binary_path", { path: selected });
        console.log("Binary path set to:", config.binary_path);
      }
    } catch (error) {
      console.error("Error selecting path:", error);
    }
  }
  return (
    <div className="grid grid-cols-2 gap-2 p-4 justify-center align-center">
      <button className="my-button" onClick={() => getDevices()}>
        Get Devices
      </button>
      <button className="my-button" onClick={() => setPort()}>
        Set Port
      </button>
      <button className="my-button" onClick={() => connectAdb()}>
        Connect ADB
      </button>
      <button className="my-button" onClick={() => gatewayButton()}>
        Get Gateway
      </button>
      <button className="my-button" onClick={() => startMirror()}>
        Start Mirror
      </button>
      <button className="my-button" onClick={() => setPath()}>
        <FolderOpen size={16} />
      </button>
    </div>
  );
}
