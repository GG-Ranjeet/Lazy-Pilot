import { listen } from "@tauri-apps/api/event";
import { useEffect, useRef, useCallback } from "react";
import { create } from "zustand";

export interface LogEntry {
  id: number;
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  source: "rust" | "frontend";
  message: string;
}

interface LogStore {
  entries: LogEntry[];
  maxEntries: number;
  addEntry: (entry: Omit<LogEntry, "id">) => void;
  clear: () => void;
  setMaxEntries: (n: number) => void;
}

let nextId = 0;

export const useLogStore = create<LogStore>((set) => ({
  entries: [],
  maxEntries: 200,
  addEntry: (entry: Omit<LogEntry, "id">) =>
    set((state: LogStore) => {
      const newEntries = [
        ...state.entries,
        { ...entry, id: nextId++ },
      ].slice(-state.maxEntries);
      return { entries: newEntries };
    }),
  clear: () => set({ entries: [] }),
  setMaxEntries: (n: number) => set({ maxEntries: n }),
}));

export function useLogCapture() {
  const storeRef = useRef(useLogStore.getState());

  useEffect(() => {
    storeRef.current = useLogStore.getState();
  }, []);

  useEffect(() => {
    const origLog = console.log;
    const origWarn = console.warn;
    const origError = console.error;

    const wrap =
      (level: LogEntry["level"]) =>
      (...args: unknown[]) => {
        const msg = args
          .map((a) =>
            typeof a === "string" ? a : JSON.stringify(a, null, 2)
          )
          .join(" ");
        storeRef.current.addEntry({
          timestamp: new Date().toLocaleTimeString(),
          level,
          source: "frontend",
          message: msg,
        });
        const orig =
          level === "error" ? origError : level === "warn" ? origWarn : origLog;
        orig(...args);
      };

    console.log = wrap("info");
    console.warn = wrap("warn");
    console.error = wrap("error");

    return () => {
      console.log = origLog;
      console.warn = origWarn;
      console.error = origError;
    };
  }, []);

  useEffect(() => {
    let unlisten: (() => void) | null = null;

    async function setup() {
      const unsubscribe = await listen<{
        level: number;
        message: string;
        target: string;
      }>("log://log", (event) => {
        const levelMap: Record<number, LogEntry["level"]> = {
          1: "error",
          2: "warn",
          3: "info",
          4: "debug",
        };
        storeRef.current.addEntry({
          timestamp: new Date().toLocaleTimeString(),
          level: levelMap[event.payload.level] || "info",
          source: "rust",
          message: `[${event.payload.target}] ${event.payload.message}`,
        });
      });
      unlisten = unsubscribe;
    }

    setup();

    return () => {
      if (unlisten) unlisten();
    };
  }, []);
}

export function useAutoScroll(ref: React.RefObject<HTMLDivElement | null>) {
  return useCallback(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [ref]);
}
