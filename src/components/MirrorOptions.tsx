import Toggle from "./Utils/Toggle";
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function MirrorOptions({state}:any) {
  
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
    console.log(
      "Starting mirror with gateway:",
      state.config.gateway,
      "and binary path:",
      `${state.config.binary_path}//scrcpy.exe`,
      "and args:",
      args
    );

    const message: string = await invoke("start_mirror", {
      customPath: `${state.config.binary_path}//scrcpy.exe`,
      args,
    });
    console.log("Mirror Started, Output:", message);
  }
  useEffect(() => {
    console.log("Mirror Config Updated:", state.mirrorConfig);
  }, [state.mirrorConfig]);
  return (
    <div className="mirror-options flex flex-col items-center justify-center gap-4 p-4">
      <div>
        <div className="fieldset bg-base-100 border-base-300 gap-4 rounded-box w-64 border p-4">
          <div className="">
            <label className="label flex items-center gap-3 cursor-pointer">
              <Toggle
                mark={true}
                default_check={state.mirrorConfig.screenOn}
                handler={(checked) =>
                  state.setMirrorConfig({ ...state.mirrorConfig, screenOn: checked })
                }
              />
              <span className="label-text">Screen On</span>
            </label>
          </div>
          <div className="">
            <label className="label flex items-center gap-3 cursor-pointer">
              <Toggle
                mark={true}
                default_check={state.mirrorConfig.alwaysOnTop}
                handler={(checked) =>
                  state.setMirrorConfig({ ...state.mirrorConfig, alwaysOnTop: checked })
                }
              />
              <span className="label-text">Always on top</span>
            </label>
          </div>
          <div className="">
            <label className="label flex items-center gap-3 cursor-pointer">
              <Toggle
                mark={true}
                default_check={state.mirrorConfig.audioForwarding}
                handler={(checked) =>
                  state.setMirrorConfig({ ...state.mirrorConfig, audioForwarding: checked })
                }
              />
              <span className="label-text">Audio Forwarding</span>
            </label>
          </div>
          <div className="">
            <label className="label flex items-center gap-3 cursor-pointer">
              <Toggle
                mark={true}
                default_check={state.mirrorConfig.videoEnabled}
                handler={(checked) =>
                  state.setMirrorConfig({ ...state.mirrorConfig, videoEnabled: checked })
                }
              />
              <span className="label-text">Video</span>
            </label>
          </div>
          <div className="">
            <label className="label flex items-center gap-3 cursor-pointer">
              <Toggle
                mark={true}
                default_check={state.mirrorConfig.showWindow}
                handler={(checked) =>
                  state.setMirrorConfig({ ...state.mirrorConfig, showWindow: checked })
                }
              />
              <span className="label-text">window</span>
            </label>
          </div>
        </div>
      </div>
          <div>
            <button className="my-button mt-4" onClick={() => startMirror()}>
              Start Mirror
            </button>
          </div>
    </div>
  );
}
