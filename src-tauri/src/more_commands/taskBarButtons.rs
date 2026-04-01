use std::process::Command;
use std::{os::windows::process::CommandExt};
use crate::utils::AppState;

#[tauri::command]
pub fn press_home_button(state: tauri::State<'_, AppState>) -> Result<(), String> {
    let adb_path = get_binary_path("adb.exe", state.adb_path.lock().unwrap().clone());
    let gateway = state.gateway.lock().unwrap().clone();

    let output = Command::new(adb_path)
        .args(["-s", &gateway, "shell", "input", "keyevent", "KEYCODE_HOME"])
        .creation_flags(0x08000000)
        .output()
        .expect("Failed to execute command");

    if output.status.success() {
        Ok(())
    } else {
        Err(format!(
            "Error pressing home button: {}",
            String::from_utf8_lossy(&output.stderr)
        ))
    }
}

#[tauri::command]
pub fn press_power_button(state: tauri::State<'_, AppState>) -> Result<(),
    String> {
        let adb_path = get_binary_path("adb.exe", state.adb_path.lock().unwrap().clone());
        let gateway = state.gateway.lock().unwrap().clone();
    
        let output = Command::new(adb_path)
            .args(["-s", &gateway, "shell", "input", "keyevent", "KEYCODE_POWER"])
            .creation_flags(0x08000000)
            .output()
            .expect("Failed to execute command");
    
        if output.status.success() {
            Ok(())
        } else {
            Err(format!(
                "Error pressing power button: {}",
                String::from_utf8_lossy(&output.stderr)
            ))
        }
    }
