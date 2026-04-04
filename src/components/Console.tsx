import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";

interface LogRecord {
  level: number;
  message: string;
  target: string;
}

export default function Console() {
  const [logs, setLogs] = useState<LogRecord[]>([]);

  useEffect(() => {
    let unlisten: (() => void) | null = null;

    async function setup() {
      // The Rust plugin emits to this specific event name: "log://log"
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

  return (
    <div style={{ background: '#111', color: '#0f0', padding: '10px', height: '200px', overflow: 'auto' }}>
      {logs.map((l, i) => (
        <div key={i}>[{l.target}] {l.message}</div>
      ))}
    </div>
  );
}