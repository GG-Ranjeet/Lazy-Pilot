import { invoke } from "@tauri-apps/api/core";
import { House, PowerIcon, Undo2, Volume1, Volume2 } from "lucide-react";
import { useState } from "react";
import Slider from "./Utils/Slider";

function UtilButton() {
  const MAX_VOLUME = 5;
  const [volume, setVolumeLevel] = useState(0);
  function goHome() {
    console.log("Going home...");
    invoke("press_home_button");
  }
  function powerButton() {
    console.log("Pressing power button...");
    invoke("press_power_button");
  }

  function increaseVolume(): void {
    console.log("Increasing volume...");
    invoke("increase_volume");
  }

  function decreaseVolume(): void {
    console.log("Decreasing volume...");
    invoke("decrease_volume");
  }

  function goBackButton(): void {
    console.log("Going back...");
    invoke("press_back_button");
  }

  function setVolume(): void {
    console.log("called");
    const mobileVolume = volume;
    console.log("Setting volume to:", mobileVolume*100/MAX_VOLUME, "%");
    try {
      if (volume !== null) {
        invoke("set_volume", { level: (mobileVolume) });
      }
    } catch (error) {
      console.error("Error setting volume:", error);
    }
  }

  return (
    <div className="flex flex-col p-5 justify-center align-center">
      <div className="flex flex-row justify-between gap-4">
        <div className="my-button flex items-center gap-2">
          <button className="" onClick={() => goHome()}>
            <House className="h-6 w-6"></House>
          </button>
        </div>
        <div className="my-button flex items-center gap-2">
          <button className="" onClick={() => powerButton()}>
            <PowerIcon className="h-6 w-6"></PowerIcon>
          </button>
        </div>
        <div className="my-button flex items-center gap-2">
          <button className="" onClick={() => goBackButton()}>
            <Undo2 className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div>
        <div className="my-button flex items-center gap-2" onClick={() => decreaseVolume()}>
          <Volume1 className="h-6 w-6"></Volume1>
            Volume-
        </div>
        <div className="my-button flex items-center gap-2" onClick={() => increaseVolume()}>
          <Volume2 className="h-6 w-6"></Volume2>
            Volume+
        </div>

        <div>          
          <Slider value={volume} onChange={setVolumeLevel} stepCount={MAX_VOLUME} showStep={true} />
          <div className="my-button flex items-center gap-2" onClick={() => setVolume()}>
            <Volume2 className="h-6 w-6"></Volume2>
              Set Volume
          </div>
        </div>
      </div>
    </div>
  );
}

export default UtilButton;
