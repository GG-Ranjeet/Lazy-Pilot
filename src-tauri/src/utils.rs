use std::sync::Mutex;

pub struct AppState {
    pub gateway: Mutex<String>,
    pub adb_path: Mutex<Option<String>>,
    pub scrcpy_path: Mutex<Option<String>>,
    pub device_name: Mutex<Option<String>>,
    pub screen_on: Mutex<bool>,
}

pub fn get_binary_path(binary_name: &str, custom_path: Option<String>) -> String {
    if let Some(path) = custom_path {
        path
    } else {
        binary_name.to_string() // Assumes it's in PATH
    }
}
