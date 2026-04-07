import { Settings, X, Monitor, Terminal, Trash2 } from "lucide-react";
import Toggle from "../components/Utils/Toggle";
import { useLogStore } from "../store/logStore";

interface AppSettings {
  showConsole: boolean;
  showRustLogs: boolean;
  showFrontendLogs: boolean;
  maxLogEntries: number;
}

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdate: (s: AppSettings) => void;
}

export default function SettingsModal({ open, onClose, settings, onUpdate }: SettingsModalProps) {
  const { clear, entries } = useLogStore();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="card w-[400px] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-[var(--accent)]" />
            <h2 className="text-base font-semibold">Settings</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="section">
          <div className="card-title">Display</div>
          <div className="section-row">
            <label className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
              <Terminal size={14} />
              Show Console
            </label>
            <Toggle
              mark={true}
              default_check={settings.showConsole}
              handler={(v) => onUpdate({ ...settings, showConsole: v })}
            />
          </div>
        </div>

        <div className="section mt-4">
          <div className="card-title">Log Filters</div>
          <div className="section-row">
            <label className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
              <Monitor size={14} />
              Rust Logs
            </label>
            <Toggle
              mark={true}
              default_check={settings.showRustLogs}
              handler={(v) => onUpdate({ ...settings, showRustLogs: v })}
            />
          </div>
          <div className="section-row">
            <label className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
              <Terminal size={14} />
              Frontend Logs
            </label>
            <Toggle
              mark={true}
              default_check={settings.showFrontendLogs}
              handler={(v) => onUpdate({ ...settings, showFrontendLogs: v })}
            />
          </div>
        </div>

        <div className="section mt-4">
          <div className="card-title">Log Buffer</div>
          <div className="section-row">
            <label className="text-sm text-[var(--text-secondary)]">
              Max entries: {settings.maxLogEntries}
            </label>
            <div className="flex gap-2">
              {[100, 200, 500].map((n) => (
                <button
                  key={n}
                  className={`btn ${settings.maxLogEntries === n ? "btn-primary" : ""}`}
                  style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                  onClick={() => onUpdate({ ...settings, maxLogEntries: n })}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="section mt-4">
          <div className="card-title">Actions</div>
          <div className="flex gap-2">
            <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => { clear(); }}>
              <Trash2 size={14} />
              Clear Logs ({entries.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
