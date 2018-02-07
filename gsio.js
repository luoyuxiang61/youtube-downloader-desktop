const fs = require('fs')
const http = require('http')
const path = require('path')
const crypto = require('crypto')
downloadNow.addEventListener('click', (evt) => {
    let hashName = crypto.createHmac('sha256', new Date().toTimeString() + new Date().toDateString()).update('i love nodejs').digest('hex').substr(2, 10)
    let videoPath = path.join(__dirname, `${hashName}.mp4`)
    fs.open(videoPath, 'w', (err, fd) => {
        let url = evt.target.link
        http.get({
            hostname: 'geekshine.io',
            port: 3000,
            path: `/geekshine.io.mp4?url=${url}`
        }, (res) => {
            res.on('end', () => alert('download ok boy'))
            res.pipe(fs.createWriteStream(videoPath))
        })
    })
})
