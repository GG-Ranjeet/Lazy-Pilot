import { useState, useCallback, useRef, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Middle from "./components/Middle";
import Browser from "./components/Browser";
import { useLogCapture, useLogStore, useAutoScroll, type LogEntry } from "./store/logStore";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

interface AppSettings {
  showConsole: boolean;
  showRustLogs: boolean;
  showFrontendLogs: boolean;
  maxLogEntries: number;
}

interface Panel {
  id: string;
  title: string;
  component: React.ReactNode;
  order: number;
}

function App() {
  useLogCapture();

  const [panels, setPanels] = useState<Panel[]>([
    { id: "controls", title: "Controls", component: <Middle />, order: 0 },
    { id: "device", title: "Device", component: <Browser />, order: 1 },
  ]);

  const [settings, setSettings] = useState<AppSettings>({
    showConsole: true,
    showRustLogs: true,
    showFrontendLogs: true,
    maxLogEntries: 200,
  });

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [consoleMinimized, setConsoleMinimized] = useState(false);

  const entries = useLogStore((s) => s.entries);
  const setMaxEntries = useLogStore((s) => s.setMaxEntries);
  const consoleRef = useRef<HTMLDivElement>(null);
  const autoScroll = useAutoScroll(consoleRef);

  useEffect(() => {
    setMaxEntries(settings.maxLogEntries);
  }, [settings.maxLogEntries, setMaxEntries]);

  useEffect(() => {
    autoScroll();
  }, [entries, autoScroll]);

  const handleDragStart = useCallback((id: string) => setDraggedId(id), []);
  const handleDragOver = useCallback(
    (e: React.DragEvent, id: string) => {
      e.preventDefault();
      if (id !== draggedId) setDragOverId(id);
    },
    [draggedId]
  );
  const handleDrop = useCallback(
    (targetId: string) => {
      if (!draggedId || draggedId === targetId) return;
      setPanels((prev) => {
        const arr = [...prev];
        const di = arr.findIndex((p) => p.id === draggedId);
        const ti = arr.findIndex((p) => p.id === targetId);
        const [item] = arr.splice(di, 1);
        arr.splice(ti, 0, item);
        return arr.map((p, i) => ({ ...p, order: i }));
      });
      setDraggedId(null);
      setDragOverId(null);
    },
    [draggedId]
  );
  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
    setDragOverId(null);
  }, []);

  const filteredLogs = entries.filter((l: LogEntry) => {
    if (l.source === "rust" && !settings.showRustLogs) return false;
    if (l.source === "frontend" && !settings.showFrontendLogs) return false;
    return true;
  });

  const sortedPanels = [...panels].sort((a, b) => a.order - b.order);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header
        settings={settings}
        onUpdateSettings={setSettings}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <div
          className="panel-grid"
          style={{
            gridTemplateColumns: "1fr 1fr",
            padding: "10px",
            gap: "10px",
            overflow: "hidden",
          }}
        >
          {sortedPanels.map((panel) => (
            <div
              key={panel.id}
              className={`card draggable-panel ${draggedId === panel.id ? "dragging" : ""} ${dragOverId === panel.id ? "ring-2 ring-[var(--accent)]" : ""}`}
              style={{ padding: "12px", overflow: "auto" }}
              draggable
              onDragStart={() => handleDragStart(panel.id)}
              onDragOver={(e) => handleDragOver(e, panel.id)}
              onDrop={() => handleDrop(panel.id)}
              onDragEnd={handleDragEnd}
            >
              <div className="drag-handle" style={{ marginBottom: "8px", padding: "4px 6px" }}>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
                  <circle cx="2" cy="2" r="1.5" />
                  <circle cx="6" cy="2" r="1.5" />
                  <circle cx="10" cy="2" r="1.5" />
                  <circle cx="2" cy="6" r="1.5" />
                  <circle cx="6" cy="6" r="1.5" />
                  <circle cx="10" cy="6" r="1.5" />
                </svg>
                {panel.title}
              </div>
              <div style={{ overflow: "hidden" }}>{panel.component}</div>
            </div>
          ))}
        </div>

        {settings.showConsole && (
          <div
            style={{
              borderTop: "1px solid var(--border-color)",
              height: consoleMinimized ? "32px" : "160px",
              transition: "height 200ms ease",
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
            }}
          >
            <div className="console-header" style={{ padding: "4px 10px", minHeight: "32px" }}>
              <div className="flex items-center gap-2">
                <button
                  className="btn btn-icon"
                  style={{ padding: "2px" }}
                  onClick={() => setConsoleMinimized(!consoleMinimized)}
                >
                  {consoleMinimized ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                <span style={{ fontSize: "0.7rem" }}>
                  Console ({filteredLogs.length})
                </span>
                <div className="flex items-center gap-1">
                  <span className={`badge ${settings.showRustLogs ? "badge-success" : "badge-warning"}`} style={{ padding: "2px 6px", fontSize: "0.6rem" }}>
                    Rust
                  </span>
                  <span className={`badge ${settings.showFrontendLogs ? "badge-success" : "badge-warning"}`} style={{ padding: "2px 6px", fontSize: "0.6rem" }}>
                    FE
                  </span>
                </div>
              </div>
              {!consoleMinimized && (
                <div className="flex gap-1">
                  <button
                    className="btn btn-icon"
                    style={{ padding: "2px" }}
                    onClick={() => useLogStore.getState().clear()}
                    title="Clear"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              )}
            </div>
            {!consoleMinimized && (
              <div className="console-body" ref={consoleRef} style={{ padding: "4px 10px", minHeight: "0", maxHeight: "120px" }}>
                {filteredLogs.map((l: LogEntry) => (
                  <div key={l.id} className="log-line" style={{ padding: "1px 0", fontSize: "0.7rem" }}>
                    <span style={{ color: "var(--text-muted)", marginRight: "6px" }}>{l.timestamp}</span>
                    <span style={{ color: l.source === "rust" ? "var(--accent)" : "var(--success)", marginRight: "4px", fontSize: "0.65rem", fontWeight: 600 }}>
                      [{l.source.toUpperCase()}]
                    </span>
                    <span style={{ color: l.level === "error" ? "var(--danger)" : l.level === "warn" ? "var(--warning)" : "var(--text-secondary)" }}>
                      {l.message}
                    </span>
                  </div>
                ))}
                {filteredLogs.length === 0 && (
                  <div style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.7rem" }}>No logs...</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
