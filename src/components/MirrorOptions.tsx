import Toggle from "./Utils/Toggle";

export default function MirrorOptions() {


  return (
    <div className="mirror-options flex flex-col items-center justify-center gap-4 p-4">
      <div>
        <div className="fieldset bg-base-100 border-base-300 gap-4 rounded-box w-64 border p-4">
          <div className="">
            <label className="label flex items-center gap-3 cursor-pointer">
              <Toggle check_mark={true} default_check={false} handler={() => {}}/>
              <span className="label-text">Audio Forwarding</span>
            </label>
          </div>
          <div className="">
            <label className="label flex items-center gap-3 cursor-pointer">
              <Toggle check_mark={true} default_check={true} handler={() => {}}/>
              <span className="label-text">Video</span>
            </label>
          </div>
          <div className="">
            <label className="label flex items-center gap-3 cursor-pointer">
              <Toggle check_mark={true} default_check={true} handler={() => {}} />
              <span className="label-text">window</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
