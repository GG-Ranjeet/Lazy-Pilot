import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { KeyRound } from 'lucide-react';

function PinPad() {
  const [pin, setPin] = useState('');

  function enterPin() {
    if (!pin) return;
    invoke("enter_pin", { pin });
    setPin('');
  }

  const handleKey = (key: string) => {
    if (key === 'DEL') {
      setPin((prev) => prev.slice(0, -1));
    } else if (key === 'ENTER') {
      enterPin();
    } else {
      setPin((prev) => prev + key);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex items-center gap-2 mb-2">
        <KeyRound size={16} className="text-[var(--accent)]" />
        <span className="text-sm font-medium text-[var(--text-secondary)]">Enter PIN</span>
      </div>
      <div className="pin-display">
        {Array.from({ length: Math.max(pin.length, 4) }).map((_, i) => (
          <div
            key={i}
            className={`pin-dot ${i < pin.length ? 'filled' : ''}`}
          />
        ))}
      </div>
      <div className="pin-grid">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'DEL', '0', 'ENTER'].map((key) => (
          <button
            key={key}
            className="pin-key"
            onClick={() => handleKey(key)}
          >
            {key === 'DEL' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                <line x1="18" y1="9" x2="12" y2="15" />
                <line x1="12" y1="9" x2="18" y2="15" />
              </svg>
            ) : key === 'ENTER' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 10 4 15 9 20" />
                <path d="M20 4v7a4 4 0 0 1-4 4H4" />
              </svg>
            ) : (
              key
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PinPad;
