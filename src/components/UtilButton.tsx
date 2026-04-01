import { invoke } from "@tauri-apps/api/core";
import { House, PowerIcon } from "lucide-react";

function UtilButton() {
  
  function goHome() {
    invoke("press_home_button");
  }
  function powerButton() {
    invoke("press_power_button");
  }


  return (
    <div className="flex flex-col p-5 justify-center align-center">
        <div className="my-button flex items-center gap-2" onClick={() => goHome()}>
          <House className="h-6 w-6"></House>
          <button className="" onClick={() => goHome()}>
            Go Home
          </button>
        </div>
        <div className="my-button flex items-center gap-2" onClick={() => powerButton()}>
          <PowerIcon className="h-6 w-6"></PowerIcon>
          <button className="" onClick={() => powerButton()}>
            Power Button
          </button>
        </div>
    </div>
  );
}

export default UtilButton;
