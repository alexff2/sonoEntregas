const { ipcMain } = require("electron");
ipcMain.on("env", (event, args) => {
  console.log(args)
  event.reply("ret", "pong")
})