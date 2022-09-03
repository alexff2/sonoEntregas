const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
let mainWindow;
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
function createWindow() {
    mainWindow = new BrowserWindow({ 
        width: 1200, 
        height: 800,
        icon: "",
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true
        }
    });
     
    mainWindow.maximize()

    mainWindow.loadURL(
        isDev
        ? "http://localhost:3334"
        : `file://${path.join(__dirname, "../build/index.html")}`
    );
    mainWindow.on("closed", () => mainWindow = null);
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
    app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
    createWindow();
    }
});