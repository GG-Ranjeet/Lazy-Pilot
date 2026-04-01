use std::process::Command;
use std::{os::windows::process::CommandExt};
use crate::utils::AppState;

fn get_binary_path(binary_name: &str, custom_path: Option<String>) -> String {
    if let Some(path) = custom_path {
        path
    } else {
        binary_name.to_string() // Assumes it's in PATH
    }
}

#[tauri::command]
pub fn set_volume(state: tauri::State<'_, AppState>, level: u8) -> Result<(), String> {
    let adb_path = get_binary_path("adb.exe", state.adb_path.lock().unwrap().clone());
    let gateway = state.gateway.lock().unwrap().clone();

    let output = Command::new(adb_path)
        .args([
            "-s",
            &gateway,
            "shell",
            "media",
            "volume",
            "--stream",
            "3",
            "--set",
            &level.to_string(),
        ])
        .creation_flags(0x08000000)
        .output()
        .expect("Failed to execute command");

    if output.status.success() {
        Ok(())
    } else {
        Err(format!(
            "Error setting volume: {}",
            String::from_utf8_lossy(&output.stderr)
        ))
    }
}

#[allow(unused)]
#[tauri::command]
pub fn increase_volume(state: tauri::State<'_, AppState>) -> Result<(), String> {
    let adb_path = get_binary_path("adb.exe", state.adb_path.lock().unwrap().clone());
    let gateway = state.gateway.lock().unwrap().clone();

    let output = Command::new(adb_path)
        .args([
            "-s",
            &gateway,
            "shell",
            "input",
            "keyevent",
            "KEYCODE_VOLUME_UP",
        ])
        .creation_flags(0x08000000)
        .output()
        .expect("Failed to execute command");

    if output.status.success() {
        Ok(())
    } else {
        Err(format!(
            "Error increasing volume: {}",
            String::from_utf8_lossy(&output.stderr)
        ))
    }
}

#[allow(unused)]
#[tauri::command]
pub fn decrease_volume(state: tauri::State<'_, AppState>) -> Result<(), String> {
    let adb_path = get_binary_path("adb.exe", state.adb_path.lock().unwrap().clone());
    let gateway = state.gateway.lock().unwrap().clone();

    let output = Command::new(adb_path)
        .args([
            "-s",
            &gateway,
            "shell",
            "input",
            "keyevent",
            "KEYCODE_VOLUME_DOWN",
        ])
        .creation_flags(0x08000000)
        .output()
        .expect("Failed to execute command");

    if output.status.success() {
        Ok(())
    } else {
        Err(format!(
            "Error decreasing volume: {}",
            String::from_utf8_lossy(&output.stderr)
        ))
    }
}
