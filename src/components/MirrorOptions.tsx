import Toggle from "./Utils/Toggle";
import { Play } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";

export default function MirrorOptions({ state }: any) {
  function getMirrorArgs() {
    const args = [];
    if (!state.mirrorConfig.screenOn) args.push("--turn-screen-off");
    if (state.mirrorConfig.alwaysOnTop) args.push("--always-on-top");
    if (state.mirrorConfig.audioForwarding) args.push("--audio-forwarding");
    if (!state.mirrorConfig.videoEnabled) args.push("--no-video");
    if (!state.mirrorConfig.showWindow) args.push("--no-display");
    return args;
  }

  async function startMirror() {
    const args = getMirrorArgs();
    await invoke("start_mirror", {
      customPath: `${state.config.binary_path}//scrcpy.exe`,
      args,
    });
  }

  const ToggleRow = ({ label, checked, onChange }: any) => (
    <div className="section-row">
      <label className="text-sm text-[var(--text-secondary)] cursor-pointer select-none">
        {label}
      </label>
      <Toggle mark={true} default_check={checked} handler={onChange} />
    </div>
  );

  return (
    <div className="section">
      <ToggleRow
        label="Screen On"
        checked={state.mirrorConfig.screenOn}
        onChange={(v: boolean) =>
          state.setMirrorConfig({ ...state.mirrorConfig, screenOn: v })
        }
      />
      <ToggleRow
        label="Always on Top"
        checked={state.mirrorConfig.alwaysOnTop}
        onChange={(v: boolean) =>
          state.setMirrorConfig({ ...state.mirrorConfig, alwaysOnTop: v })
        }
      />
      <ToggleRow
        label="Audio Forwarding"
        checked={state.mirrorConfig.audioForwarding}
        onChange={(v: boolean) =>
          state.setMirrorConfig({ ...state.mirrorConfig, audioForwarding: v })
        }
      />
      <ToggleRow
        label="Video"
        checked={state.mirrorConfig.videoEnabled}
        onChange={(v: boolean) =>
          state.setMirrorConfig({ ...state.mirrorConfig, videoEnabled: v })
        }
      />
      <ToggleRow
        label="Show Window"
        checked={state.mirrorConfig.showWindow}
        onChange={(v: boolean) =>
          state.setMirrorConfig({ ...state.mirrorConfig, showWindow: v })
        }
      />
      <button className="btn btn-primary" onClick={startMirror}>
        <Play size={14} />
        Start Mirror
      </button>
    </div>
  );
}
