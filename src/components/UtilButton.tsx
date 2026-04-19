import { invoke } from "@tauri-apps/api/core";
import {
  House,
  PowerIcon,
  Undo2,
  Volume1,
  Volume2,
  MonitorOff,
  Monitor,
} from "lucide-react";
import { useState } from "react";
import Slider from "./Utils/Slider";

function UtilButton() {
  const MAX_VOLUME = 5;
  const [volume, setVolumeLevel] = useState(0);
  const [screenOn, setScreenOn] = useState(true);

  function goHome() {
    invoke("press_home_button");
  }

  function powerButton() {
    invoke("press_power_button");
  }

  function increaseVolume(): void {
    invoke("increase_volume");
  }

  function decreaseVolume(): void {
    invoke("decrease_volume");
  }

  function goBackButton(): void {
    invoke("press_back_button");
  }

  async function toggleScreen(): Promise<void> {
    try {
      await invoke<string>("toggle_device_screen");
      setScreenOn((prev) => !prev);
    } catch (error) {
      console.error("Error toggling screen:", error);
    }
  }

  function setVolume(): void {
    const mobileVolume = volume;
    try {
      if (volume !== null) {
        invoke("set_volume", { level: mobileVolume });
      }
    } catch (error) {
      console.error("Error setting volume:", error);
    }
  }

  return (
    <div className="section">
      <div className="section-row">
        <button className="btn btn-icon" onClick={powerButton} title="Power">
          <PowerIcon size={18} />
        </button>
        <button className="btn btn-icon" onClick={goHome} title="Home">
          <House size={18} />
        </button>
        <button className="btn btn-icon" onClick={goBackButton} title="Back">
          <Undo2 size={18} />
        </button>
        <button className="btn btn-icon" onClick={toggleScreen} title="Toggle Screen">
          {screenOn ? <MonitorOff size={18} /> : <Monitor size={18} />}
        </button>
      </div>

      <div className="section">
        <div className="flex items-center gap-2">
          <Volume1 size={14} className="text-[var(--text-muted)]" />
          <Slider
            value={volume}
            onChange={setVolumeLevel}
            stepCount={MAX_VOLUME}
            showStep={false}
          />
          <Volume2 size={14} className="text-[var(--text-muted)]" />
        </div>
        <div className="flex gap-2 mt-3">
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={setVolume}>
            Set Volume
          </button>
          <button className="btn" onClick={decreaseVolume}>
            <Volume1 size={14} />
          </button>
          <button className="btn" onClick={increaseVolume}>
            <Volume2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default UtilButton;
