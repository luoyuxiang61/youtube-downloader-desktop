const fs = require('fs')
const http = require('http')
const path = require('path')


let linkInput = document.getElementById('linkInput')
let downloadBtn = document.getElementById('downloadBtn')
let giveMeLink = document.getElementById('giveMeLink')


giveMeLink.addEventListener('click', (e) => {
    let videoLink = linkInput.value
    let encodedVideoLink = [...videoLink].map(x => x.codePointAt(0)).toString()

    http.get({
        hostname: 'geekshine.io',
        port: 3000,
        path: `/download720Ftp?url=${encodedVideoLink}`
    }, (res) => {
        let data = ''
        res.on('data', (chunk) => {
            data += chunk
        })
        res.on('end', () => {
            let info = JSON.parse(data)
            console.log(info)
            downloadBtn.style.display = 'block'
            downloadBtn.hashName = info.videoName
        })
    })
})

linkInput.addEventListener('keydown', () => {
    downloadBtn.style.display = 'none'
})



downloadBtn.addEventListener('click', (evt) => {
    downloadBtn.style.display = 'none'
    let videoTimeName = evt.target.hashName
    let videoPath = path.join(__dirname, `${videoTimeName}`)
    fs.open(videoPath, 'w', (err, fd) => {
        let hashName = evt.target.hashName
        http.get({
            hostname: 'geekshine.io',
            port: 3000,
            path: `/downloadByHashName?hashName=${hashName}`
        }, (res) => {
            res.on('end', () => {
                alert('download ok boy')
                fs.stat(videoPath, (err, stats) => {
                    console.log(stats)
                })
            })
            res.pipe(fs.createWriteStream(videoPath))
        })
    })
})
