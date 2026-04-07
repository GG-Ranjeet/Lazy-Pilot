import { listen } from "@tauri-apps/api/event";
import { useEffect, useState, useRef } from "react";
import { Trash2 } from "lucide-react";

interface LogRecord {
  level: number;
  message: string;
  target: string;
}

export default function Console() {
  const [logs, setLogs] = useState<LogRecord[]>([]);
  const [collapsed, setCollapsed] = useState(true);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let unlisten: (() => void) | null = null;

    async function setup() {
      const unsubscribe = await listen<LogRecord>("log://log", (event) => {
        setLogs((prev) => [...prev, event.payload].slice(-100));
      });
      unlisten = unsubscribe;
    }

    setup();

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  if (collapsed) {
    return (
      <div
        className="console-header cursor-pointer"
        onClick={() => setCollapsed(false)}
      >
        <span>Console ({logs.length})</span>
      </div>
    );
  }

  return (
    <div>
      <div className="console-header">
        <span>Console ({logs.length})</span>
        <div className="flex gap-2">
          <button
            className="btn btn-icon"
            style={{ padding: "4px" }}
            onClick={() => setLogs([])}
            title="Clear"
          >
            <Trash2 size={12} />
          </button>
          <button
            className="btn btn-icon"
            style={{ padding: "4px" }}
            onClick={() => setCollapsed(true)}
            title="Collapse"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>
      <div className="console-body" ref={consoleRef}>
        {logs.map((l, i) => (
          <div key={i} className="log-line">
            <span className="log-target">[{l.target}]</span> {l.message}
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-[var(--text-muted)] italic">No logs yet...</div>
        )}
      </div>
    </div>
  );
}
