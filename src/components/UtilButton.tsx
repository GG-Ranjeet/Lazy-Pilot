import { invoke } from '@tauri-apps/api/core'

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
    async function startMirror() {
        const message: string = await invoke("start_mirror");
        console.log("Mirror Started, Output:", message);
    }
  return (
    <div>
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