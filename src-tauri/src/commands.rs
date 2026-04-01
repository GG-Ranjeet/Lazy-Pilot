use std::os::windows::process::CommandExt;
use std::process::Command;
use crate::utils::AppState;
use crate::utils::get_binary_path;

#[tauri::command]
pub fn set_binary_path(
    state: tauri::State<'_, crate::utils::AppState>,
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

    let mut adb = state.adb_path.lock().unwrap();
    *adb = Some(adb_path.to_str().unwrap().to_string()); // Store the adb path for later use

    let mut scrcpy = state.scrcpy_path.lock().unwrap();
    *scrcpy = Some(scrcpy_path.to_str().unwrap().to_string()); // Store the scrcpy path for later use

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
pub fn get_devices(
    state: tauri::State<'_, AppState>,
    custom_path: Option<String>,
) -> Result<String, String> {
    let adb_path = state
        .adb_path
        .lock()
        .unwrap()
        .clone()
        .unwrap_or_else(|| get_binary_path("adb", custom_path));
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
pub fn set_port(
    state: tauri::State<'_, AppState>,
    custom_path: Option<String>,
) -> Result<String, String> {
    let adb_path = state
        .adb_path
        .lock()
        .unwrap()
        .clone()
        .unwrap_or_else(|| get_binary_path("adb", custom_path));
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
pub fn connect_adb(
    state: tauri::State<'_, AppState>,
    custom_path: Option<String>,
) -> Result<String, String> {
    let gateway = state.gateway.lock().unwrap();
    let device_address = format!("{}:5555", *gateway);
    let adb_path = state
        .adb_path
        .lock()
        .unwrap()
        .clone()
        .unwrap_or_else(|| get_binary_path("adb", custom_path));

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
pub async fn start_mirror(
    state: tauri::State<'_, AppState>,
    custom_path: Option<String>,
    args: Option<Vec<String>>,
) -> Result<String, String> {
    let device_ip = state.gateway.lock().unwrap().clone();

    let is_running = state.device_name.lock().unwrap().is_some();
    if is_running {
        println!("Session already running... focusing the window");
        focus_the_window();
        return Ok(format!("Started scrcpy with device IP: {}", device_ip));
    }
    println!("No existing session, starting a new one...");

    {
        let device_name = get_device_name();
        *state.device_name.lock().unwrap() = Some(device_name.clone());
    }

    // println!("Custom path received in Rust: {:?}", custom_path);
    let scrcpy_path = state
        .scrcpy_path
        .lock()
        .unwrap()
        .clone()
        .unwrap_or_else(|| get_binary_path("scrcpy", custom_path));
    let mut newargs = args.unwrap_or_default();
    newargs.push("--window-x=1515".to_string());
    newargs.push("--window-y=50".to_string());

    let output: Result<std::process::ExitStatus, std::io::Error> = Command::new(&scrcpy_path)
        .args(newargs)
        .creation_flags(0x08000000)
        .status();

    {
        let mut name_lock = state.device_name.lock().unwrap();
        *name_lock = None;
        println!("Scrcpy window closed. State cleared.");
    }

    match output {
        Ok(status) if status.success() => Ok(format!(
            "Scrcpy finished successfully for IP: {}",
            device_ip
        )),
        _ => Err("Scrcpy closed with an error or was interrupted".to_string()),
    }
}

fn get_device_name() -> String {
    let script = "adb shell getprop ro.product.model";
    let model_output = Command::new("powershell")
        .args(["-command", script])
        .creation_flags(0x08000000)
        .output()
        .expect("Failed to execute command");

    if model_output.status.success() {
        let stdout = String::from_utf8_lossy(&model_output.stdout)
            .trim()
            .to_string();
        let model_name: String = stdout.lines().collect::<Vec<&str>>()[0].to_string();
        return model_name;
    } else {
        let stderr = String::from_utf8_lossy(&model_output.stderr)
            .trim()
            .to_string();
        return stderr;
    }
}

fn focus_the_window() {
    let script = format!(
        "(New-Object -ComObject WScript.Shell).AppActivate((adb shell getprop ro.product.model).Trim())",
    );

    let output = Command::new("powershell")
        .args(["-command", &script])
        .creation_flags(0x08000000)
        .output()
        .expect("Failed to execute command");

    if output.status.success() {
        println!("Window focused successfully");
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr).to_string();
        println!("Error focusing window: {}", stderr);
    }
}
