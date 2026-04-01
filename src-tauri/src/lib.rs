#[cfg_attr(mobile, tauri::mobile_entry_point)]
use std::sync::Mutex;
mod commands;
pub mod utils;
use crate::utils::AppState;
mod more_commands {
    pub mod volume_commands;
    // pub mod DeviceCommand;
    // pub mod MirrorCommand;
    // pub mod PinCommand;
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(AppState {
            gateway: Mutex::new("192.168.1.1".to_string()),
            adb_path: Mutex::new(None),
            scrcpy_path: Mutex::new(None),
            device_name: Mutex::new(None),
        })
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            commands::get_devices,
            commands::set_port,
            commands::connect_adb,
            commands::get_and_set_gateway,
            commands::set_binary_path,
            commands::start_mirror,
            more_commands::volume_commands::set_volume,
            more_commands::volume_commands::increase_volume,
            more_commands::volume_commands::decrease_volume,
            commands::press_home_button,
            commands::press_power_button,
            commands::enter_pin,

        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
