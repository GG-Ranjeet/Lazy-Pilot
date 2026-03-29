import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core'

function PinPad() {
  const [pin, setPin] = useState('');

  function enterPin() {
    console.log("Entering PIN:", pin);
    invoke("enter_pin", { pin });
  }

  return (
    <div className="pin-pad flex flex-col items-center justify-center gap-4 p-4">
      <input 
        type="text" 
        id="pin-input" 
        placeholder="Enter PIN" 
        className='input'
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