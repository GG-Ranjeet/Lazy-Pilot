// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// adb tcpip 5555
// adb connect <IP_ADDRESS>:5555

fn main() {
  app_lib::run();
}
