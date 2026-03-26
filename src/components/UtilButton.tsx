import { invoke } from '@tauri-apps/api/core'

function UtilButton() {
  var gateway: string = "";

    function goHome() {
        invoke("press_home_button", { gateway: gateway });
    }
    function powerButton() {
        invoke("press_power_button", { gateway: gateway });
    }
    async function gatewayButton() {
        const output: string = await invoke("get_gateway");
        gateway = output;
        console.log("Default Gateway:", output);
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
    </div>
  );
}

export default UtilButton;