#[cfg_attr(mobile, tauri::mobile_entry_point)]
use std::process::Command;
use std::{os::windows::process::CommandExt, sync::Mutex};
use tauri_plugin_shell::ShellExt;

struct AppState {
    gateway: Mutex<String>,
}

#[tauri::command]
fn get_and_set_gateway(state: tauri::State<'_, AppState>) -> Result<String, String> {
    let script = "(Get-NetRoute -DestinationPrefix 0.0.0.0/0).NextHop";

    let output = Command::new("powershell")
        .args(["-command", script])
        .creation_flags(0x08000000)
        .output()
        .expect("Failed to execute command");

    println!("Command output: {}", String::from_utf8_lossy(&output.stdout));
    if output.status.success() {  
        let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
        let myoutput: String = stdout.lines().collect::<Vec<&str>>()[0].to_string(); // Could be buggy if there are no lines, but it works for now
        let mut gateway_lock = state.gateway.lock().unwrap();
        *gateway_lock = myoutput.clone();
        Ok(myoutput)
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr).to_string();
        Err(format!("Error: {}", stderr))
    }
}

#[tauri::command]
fn set_port() -> Result<String, String> {
    let output = Command::new("adb")
        .args(["tcpip", "5555"])
        .output()
        .expect("Failed to execute command");

    if output.status.success() {
        println!("ADB set to TCP/IP mode on port 5555");
        Ok("Success".to_string())
    } else {
        // let stderr = String::from_utf8_lossy(&output.stderr).to_string();
        Err("Error".to_string())
    }
}

// #[tauri::command]
// fn init_adb() -> String {
//     println!("Initializing ADB connection in Rust!");

//     // Using the IP that worked in your CMD

//     let output = Command::new("adb")
//         .args(["connect", "192.0.0.2:5555"])

#[tauri::command]
fn press_home_button(state: tauri::State<'_, AppState>) -> String {
    println!("Home button pressed in Rust!");

    let output = Command::new("adb")
        .args(["-s", &format!("{}:5555", state.gateway.lock().unwrap()), "shell", "input", "keyevent", "3"])
        .output();

    match output {
        Ok(_) => "Success: Home button pressed".to_string(),
        Err(e) => format!("Error: {}", e),
    }
}

#[tauri::command]
fn press_power_button(state: tauri::State<'_, AppState>) -> Result<String, String> {
    let gateway = state.gateway.lock().unwrap();
    let device_address = format!("{}:5555", *gateway);

    let output = std::process::Command::new("adb")
        .args(["-s", &device_address, "shell", "input", "keyevent", "26"])
        .output()
        .map_err(|e| format!("Failed to execute process: {}", e))?;

    if output.status.success() {
        Ok("Success: Power button pressed".to_string())
    } else {
        // This captures the ACTUAL error from ADB (e.g., "device not found")
        let error_msg = String::from_utf8_lossy(&output.stderr);
        Err(format!("ADB Error: {}", error_msg.trim()))
    }
}

#[tauri::command]
fn enter_pin(state: tauri::State<'_, AppState>, pin: String) -> String {
    let message = pin.replace(" ", "%s");
    let output = Command::new("adb")
        .args(["-s", &format!("{}:5555", state.gateway.lock().unwrap()), "shell", "input", "text", &message])
        .output();
    match output {
        Ok(_) => format!("Success: PIN entered {}", pin),
        Err(e) => format!("Error: {}", e),
    }
}

// #[tauri::command]
// fn launch_mirroring(state: tauri::State<'_, AppState>, handle: tauri::AppHandle) {
//     let device_ip = &format!("{}:5555", state.gateway.lock().unwrap()); // Your wireless IP

//     // This calls the 'scrcpy' sidecar we bundled
//     let sidecar_command = handle.shell().sidecar("scrcpy").unwrap().args([
//         "-s",
//         device_ip,
//         "--always-on-top",
//         "--window-title",
//         "Phone Pilot Mirror",
//         "--stay-awake",
//     ]);

//     let (_rx, _child) = sidecar_command.spawn().expect("Failed to launch Scrcpy");
// }

#[tauri::command]
fn start_mirror(state: tauri::State<'_, AppState>, app: tauri::AppHandle) {
    let device_ip = &format!("{}:5555", state.gateway.lock().unwrap()); // Your wireless IP

    let (mut rx, _child) = app
        .shell()
        .sidecar("scrcpy")
        .unwrap()
        .args(["-s", device_ip, "--always-on-top"])
        .spawn()
        .expect("Failed to spawn sidecar");

    // This loop will print the REAL error to your terminal
    tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
            // We use a match here so we only look at 'event' once
            match event {
                tauri_plugin_shell::process::CommandEvent::Stderr(line) => {
                    println!("Scrcpy Error: {}", String::from_utf8_lossy(&line));
                }
                tauri_plugin_shell::process::CommandEvent::Stdout(line) => {
                    println!("Scrcpy Output: {}", String::from_utf8_lossy(&line));
                }
                _ => {} // Ignore other events like 'Terminated'
            }
        }
    });
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(AppState {
            gateway: Mutex::new("192.168.1.1:5555".to_string()),
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            press_home_button,
            press_power_button,
            enter_pin,
            set_port,
            get_and_set_gateway,
            start_mirror
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
