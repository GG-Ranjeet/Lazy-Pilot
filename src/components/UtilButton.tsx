import { invoke } from '@tauri-apps/api/core'
import { Command } from '@tauri-apps/plugin-shell';


function UtilButton() {
  var gateway: string = "";

    function goHome() {
        invoke("press_home_button");
    }
    function powerButton() {
        invoke("press_power_button");
    }
    async function gatewayButton() {
        const output: string = await invoke("get_and_set_gateway");
        gateway = output;
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
      const command = Command.sidecar("binaries/scrcpy/scrcpy")
      const output = await command.execute();
      console.log("Scrcpy Output:", output);
        const message: string = await invoke("start_mirror");
        console.log("Mirror Started, Output:", message);
      
    }
  return (
    <div>
        <h1>Utility Buttons</h1>
        <button
          className="my-button"
          onClick={()=>goHome()}
        >
          Go Home
        </button>
        <button
          className="my-button"
          onClick={()=>powerButton()}
        >
          Power Button
        </button>
        <hr />
        <h1>ADB Control</h1>
        
        <button
          className="my-button"
          onClick={()=>getDevices()}
        >
          Get Devices
        </button>
        <button
          className="my-button"
          onClick={()=>setPort()}
        >
          Set Port
        </button>
        <button
          className="my-button"
          onClick={()=>connectAdb()}
        >
          Connect ADB
        </button>
        <button
          className="my-button"
          onClick={()=>gatewayButton()}
        >
          Get Gateway
        </button>
        <button
          className="my-button"
          onClick={()=>startMirror()}
        >
          Start Mirror
        </button>
    </div>
  );
}

export default UtilButton;