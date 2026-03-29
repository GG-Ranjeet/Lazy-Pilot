import { invoke } from "@tauri-apps/api/core";

function UtilButton() {
  
  function goHome() {
    invoke("press_home_button");
  }
  function powerButton() {
    invoke("press_power_button");
  }


  return (
    <div className="flex flex-col p-5 justify-center align-center">
        <button className="my-button" onClick={() => goHome()}>
          Go Home
        </button>
        <button className="my-button" onClick={() => powerButton()}>
          Power Button
        </button>
    </div>
  );
}

export default UtilButton;
