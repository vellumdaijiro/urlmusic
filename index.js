const electron = require("electron")
const fs = require("fs")

var globalShortcut = electron.globalShortcut
var app = electron.app
var BrowserWindow = electron.BrowserWindow
var Menu = electron.Menu
// Menu.setApplicationMenu(null)

fs.exists("./cache.json", function (exist) {
  if (exist) {
    console.log("cache.json已存在，无需操作")
  } else {
    console.log("正在创建cache.json")
    fs.writeFile("cache.json", JSON.stringify({
      "playNumber": 0,
      "playlistNumber": ""
    }), function (err) {
      if (err) {
        console.error(err)
      } else {
        console.log("cache.json创建并写入成功")
      }
    })
  }
})
fs.exists("./playlist.json", function (exist) {
  if (exist) {
    console.log("playlist.json已存在，无需操作")
  } else {
    console.log("正在创建playlist.json")
    fs.writeFile("playlist.json", JSON.stringify([
      {
        "name": "",
        "url": ""
      }
    ]), function (err) {
      if (err) {
        console.error(err)
      } else {
        console.log("playlist.json创建并写入成功")
      }
    })
  }
})
// fs.exists("./playlist.json", function (exist) {
//   if (exist) {
//     console.log("README", exist);
//   }else {
//     fs.writeFile("README.TXT", "在playlist.json中添加你的歌单\n", function (err) {
//       if (err) {
//         console.error(err)
//       }
//     })
//   }
// })
let window = null
function createWindow() {

  window = new BrowserWindow({
    height: 800,
    width: 1200,
    webPreferences: {
      nodeIntegration: true
    },
    icon: "./icon.png"
  })
  console.log("子窗口创建了")
  
  window.loadFile("main.html")
  window.on("close", function() {
    window = null
    console.log("子窗口关闭了")
  })
  // window.webContents.openDevTools()
}

app.on("ready", function() {
  createWindow()
  globalShortcut.register("Ctrl+Left", function () {
    window.webContents.send("player-control", "player-back")
  })
  globalShortcut.register("Ctrl+Right", function () {
    window.webContents.send("player-control", "player-next")
  })
  globalShortcut.register("Ctrl+End", function () {
    window.webContents.send("player-control", "player-pause")
  })
  globalShortcut.register("Ctrl+Up", function () {
    window.webContents.send("player-control", "volume-up")
  })
  globalShortcut.register("Ctrl+Down", function () {
    window.webContents.send("player-control", "volume-down")
  })
})
app.on("will-quit", function () {
  globalShortcut.unregisterAll()
})