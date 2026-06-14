// Preload script — runs in a privileged context before the renderer
// We don't expose any IPC for now; localStorage in the renderer handles all persistence.
import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
});
