import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core'

function PinPad() {
  const [pin, setPin] = useState('');

  function enterPin() {
    console.log("Entering PIN:", pin);
    invoke("enter_pin", { pin });
  }

  return (
    <div className="pin-pad">
      <input 
        type="text" 
        id="pin-input" 
        placeholder="Enter PIN" 
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />
        <button
          className="my-button"
          onClick={()=>enterPin()}
        >
          Enter PIN
        </button>
    </div>
  );
}

export default PinPad;