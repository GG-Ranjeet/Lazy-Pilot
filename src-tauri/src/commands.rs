use std::process::Command;
use std::{os::windows::process::CommandExt, sync::Mutex};
use tauri::Manager;
use tauri_plugin_shell::ShellExt;

pub struct AppState {
    pub gateway: Mutex<String>,
    pub adb_path: Mutex<Option<String>>,
    pub scrcpy_path: Mutex<Option<String>>,
}

fn get_binary_path(binary_name: &str, custom_path: Option<String>) -> String {
    if let Some(path) = custom_path {
        path
    } else {
        binary_name.to_string() // Assumes it's in PATH
    }
}

#[tauri::command]
pub fn set_binary_path(
    state: tauri::State<'_, AppState>,
    binary_name: String,
    path: String,
) -> Result<(), String> {
    // Check if the provided path has adb and scrcpy
    let adb_path = std::path::PathBuf::from(&path).join("adb.exe");
    let scrcpy_path = std::path::PathBuf::from(&path).join("scrcpy.exe");

    if !adb_path.exists() || !scrcpy_path.exists() {
        return Err(format!(
            "Missing binaries in path: adb={}, scrcpy={}",
            adb_path.exists(),
            scrcpy_path.exists()
        ));
    }

    match binary_name.as_str() {
        "adb" => {
            let mut adb = state.adb_path.lock().unwrap();
            *adb = Some(path);
        }
        "scrcpy" => {
            let mut scrcpy = state.scrcpy_path.lock().unwrap();
            *scrcpy = Some(path);
        }
        _ => return Err("Invalid binary name".into()),
    }
    Ok(())
}

#[tauri::command]
pub fn get_and_set_gateway(state: tauri::State<'_, AppState>) -> Result<String, String> {
    let script = "(Get-NetRoute -DestinationPrefix 0.0.0.0/0).NextHop";

    let output = Command::new("powershell")
        .args(["-command", script])
        .creation_flags(0x08000000)
        .output()
        .expect("Failed to execute command");

    println!(
        "Command output: {}",
        String::from_utf8_lossy(&output.stdout)
    );
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
pub fn get_devices(state: tauri::State<'_, AppState>, custom_path: Option<String>) -> Result<String, String> {
    let adb_path = state.adb_path.lock().unwrap().clone().unwrap_or_else(|| get_binary_path("adb", custom_path));
    let output = Command::new(&adb_path)
        .args(["devices"])
        .output()
        .expect("Failed to execute command");

    if output.status.success() {
        let stdout = String::from_utf8_lossy(&output.stdout).to_string();
        Ok(stdout)
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr).to_string();
        Err(format!("Error: {}", stderr))
    }
}

#[tauri::command]
pub fn set_port(state: tauri::State<'_, AppState>, custom_path: Option<String>) -> Result<String, String> {
    let adb_path = state.adb_path.lock().unwrap().clone().unwrap_or_else(|| get_binary_path("adb", custom_path));
    let output = Command::new(&adb_path)
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

#[tauri::command]
pub fn connect_adb(state: tauri::State<'_, AppState>, custom_path: Option<String>) -> Result<String, String> {
    let gateway = state.gateway.lock().unwrap();
    let device_address = format!("{}:5555", *gateway);
    let adb_path = state.adb_path.lock().unwrap().clone().unwrap_or_else(|| get_binary_path("adb", custom_path));

    let output = Command::new(&adb_path)
        .args(["connect", &device_address])
        .output()
        .expect("Failed to execute command");

    if output.status.success() {
        println!("ADB connected to {}", device_address);
        Ok(format!("Connected to {}", device_address))
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr).to_string();
        Err(format!("Error: {}", stderr))
    }
}

// #[tauri::command]
// fn init_adb() -> String {
//     println!("Initializing ADB connection in Rust!");

//     // Using the IP that worked in your CMD

//     let output = Command::new("adb")
//         .args(["connect", "192.0.0.2:5555"])

#[tauri::command]
pub fn press_home_button(state: tauri::State<'_, AppState>) -> String {
    println!("Home button pressed in Rust!");

    let output = Command::new("adb")
        .args([
            "-s",
            &format!("{}:5555", state.gateway.lock().unwrap()),
            "shell",
            "input",
            "keyevent",
            "3",
        ])
        .output();

    match output {
        Ok(_) => "Success: Home button pressed".to_string(),
        Err(e) => format!("Error: {}", e),
    }
}

#[tauri::command]
pub fn press_power_button(state: tauri::State<'_, AppState>) -> Result<String, String> {
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
pub fn enter_pin(state: tauri::State<'_, AppState>, pin: String) -> String {
    let message = pin.replace(" ", "%s");
    let output = Command::new("adb")
        .args([
            "-s",
            &format!("{}:5555", state.gateway.lock().unwrap()),
            "shell",
            "input",
            "text",
            &message,
        ])
        .output();
    match output {
        Ok(_) => format!("Success: PIN entered {}", pin),
        Err(e) => format!("Error: {}", e),
    }
}

#[tauri::command]
pub fn launch_mirroring(state: tauri::State<'_, AppState>, handle: tauri::AppHandle) {
    let device_ip = &format!("{}:5555", state.gateway.lock().unwrap());

    let sidecar_command = handle.shell().sidecar("scrcpy").unwrap().args([
        "-s",
        device_ip,
        "--always-on-top",
        "--window-title",
        "Phone Pilot Mirror",
        "--stay-awake",
    ]);

    let (_rx, _child) = sidecar_command.spawn().expect("Failed to launch Scrcpy");
}
// Required for path resolution

#[tauri::command]
pub async fn start_mirror(
    state: tauri::State<'_, AppState>,
    app: tauri::AppHandle,
) -> Result<String, String> {
    let device_ip = state.gateway.lock().unwrap().clone();

    // 1. Get the path where your DLLs and ADB are bundled
    let resource_path = app
        .path()
        .resource_dir()
        .map_err(|e| e.to_string())?
        .join("binaries/scrcpy");

    println!("Looking for sidecar files in: {:?}", resource_path);

    let (mut rx, _child) = app
        .shell()
        .sidecar("binaries/scrcpy/scrcpy")
        .map_err(|e| e.to_string())?
        // 3. CRITICAL: Tell scrcpy where to find its DLLs and scrcpy-server
        .env(
            "SCRCPY_SERVER_PATH",
            resource_path.join("scrcpy-server").to_str().unwrap(),
        )
        .args(["-s", &device_ip, "--always-on-top"])
        .spawn()
        .map_err(|e| format!("Failed to launch scrcpy: {}", e))?;

    // 4. Monitor the output (Crucial for debugging why it closes)
    tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
            if let tauri_plugin_shell::process::CommandEvent::Stderr(line) = event {
                println!("SCRCPY LOG: {}", String::from_utf8_lossy(&line));
            }
        }
    });

    Ok("Mirroring started".to_string())
}
