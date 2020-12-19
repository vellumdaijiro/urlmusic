fs.exists("./cache.json", function (exist) {
  if (exist) {
    console.log("cache.json已存在，无需操作")
  }else {
    console.log("正在创建cache.json")
    fs.writeFile("cache.json", JSON.stringify({
      "number": 0,
      "playlist": ""
    }), function (err) {
      if (err) {
        console.error(err)
      }else {
        console.log("cache.json创建并写入成功")
      }
    })
  }
})
fs.exists("./playlist.json", function (exist) {
  if (exist) {
    console.log("playlist.json已存在，无需操作")
  }else {
    console.log("正在创建playlist.json")
    fs.writeFile("playlist.json", JSON.stringify([
      {
        "name": "",
        "url": ""
      }
    ]), function (err) {
      if (err) {
        console.error(err)
      }else {
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