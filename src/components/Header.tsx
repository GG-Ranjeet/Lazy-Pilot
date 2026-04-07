import { Minus, Square, X, Settings } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useState } from "react";
import SettingsModal from "./Settings";

interface AppSettings {
  showConsole: boolean;
  showRustLogs: boolean;
  showFrontendLogs: boolean;
  maxLogEntries: number;
}

interface HeaderProps {
  settings: AppSettings;
  onUpdateSettings: (s: AppSettings) => void;
}

export default function Header({ settings, onUpdateSettings }: HeaderProps) {
  const appWindow = getCurrentWindow();
  const [settingsOpen, setSettingsOpen] = useState(false);

  async function minimize() {
    await appWindow.minimize();
  }

  async function toggleMaximize() {
    const isMaximized = await appWindow.isMaximized();
    if (isMaximized) {
      await appWindow.unmaximize();
    } else {
      await appWindow.maximize();
    }
  }

  async function close() {
    await appWindow.close();
  }

  return (
    <>
      <div className="app-header">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-bg)] border border-[var(--border-color)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
          </div>
          <h1>Lazy Pilot</h1>
        </div>
        <div className="header-actions">
          <button className="btn btn-icon" onClick={() => setSettingsOpen(true)} title="Settings">
            <Settings size={15} />
          </button>
          <button className="btn btn-icon" onClick={minimize} title="Minimize">
            <Minus size={14} />
          </button>
          <button className="btn btn-icon" onClick={toggleMaximize} title="Maximize">
            <Square size={12} />
          </button>
          <button className="btn btn-icon btn-danger" onClick={close} title="Close">
            <X size={14} />
          </button>
        </div>
      </div>
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdate={onUpdateSettings}
      />
    </>
  );
}
