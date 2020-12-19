const fs = require("fs")
const {ipcRenderer} = require("electron")

var app = new Vue({
  el: "#app",
  data: {
    isOnline: window.navigator.onLine,
    volume: document.querySelector("#player").volume,
    playNumber: 0,
    playlistNumber: 0,
    playlistName: "",
    playlistList: [],
    playlist: [{}],
    loaderActive: false
  },
  methods: {
    getPlaylist(object, event) {
      let fileUrl = null;
      let fileName = null;
      if (!object) {
        fileUrl = event.dataTransfer.files[0].path
        fileName = event.dataTransfer.files[0].name
      }
      // console.log(object)
      let file = JSON.parse(fs.readFileSync(fileUrl || object.url))
      fileName = object.name
      
      if (this.playNumber >= file.length-1) {
        this.playNumber = file.length-1
      }
      this.playlist = file
      this.playlistName = fileName
    },
    next() {
      this.playNumber++
      if (this.playNumber >= this.playlist.length-1) {
        this.playNumber = 0
      }
      setTimeout(() => {
        document.querySelector("#player").play()
      }, 10);
      console.log("播放完毕")
    },
    back() {
      this.playNumber--
      if (this.playNumber < 0) {
        this.playNumber = this.playlist.length - 1
      }
      setTimeout(() => {
        document.querySelector("#player").play()
      }, 10);
      console.log("播放完毕")
    },
    volumeUp() {
      if (document.querySelector("#player").volume + 0.05 <= 1) {
        this.volume = Math.round((this.volume + 0.05) * 100) / 100
        document.querySelector("#player").volume = this.volume
      }
      console.log(document.querySelector("#player").volume);
    },
    volumeDown() {
      if (document.querySelector("#player").volume - 0.05 >= 0) {
        this.volume = Math.round((this.volume - 0.05) * 100) / 100
        document.querySelector("#player").volume = this.volume
      }
      console.log(document.querySelector("#player").volume);
    },
    switchPlayStatus() {
      let player = document.querySelector("#player")
      if (player.paused) {
        player.play()
      }else {
        player.pause()
      }
    },
    switchMusic(num) {
      this.playNumber = num
      setTimeout(() => {
        document.querySelector("#player").play()
      }, 10);
    }
  },
  updated: function () {
    fs.writeFileSync("./cache.json", JSON.stringify({
      "playNumber": app.playNumber,
      "playlistNumber": app.playlistNumber
    }))
  }
})
var urlList = JSON.parse(fs.readFileSync("./playlist.json"))
var list = []
for (let i = 0; i < urlList.length; i++) {
  list.push({
    "name": urlList[i].name,
    "url": urlList[i].url
  })
}
app.playlistList = list

var cache = JSON.parse(fs.readFileSync("./cache.json"))
app.playNumber = cache.playNumber
app.playlistNumber = cache.playlistNumber
console.log(cache.playNumber, cache.playlistNumber);

let _object = list[cache.playlistNumber]
app.getPlaylist({ "name": _object.name, "url": _object.url })
// app.playlist = app.getPlaylist(app.playlistList[cache.playlistNumber])
ipcRenderer.on("player-control", function (event, message) {
  if (message == "volume-up") {
    app.volumeUp()
  } else if (message == "volume-down") {
    app.volumeDown()
  } else if (message == "player-pause") {
    app.switchPlayStatus()
  } else if (message == "player-back") {
    app.back()
  } else if (message == "player-next") {
    app.next()
  }
})