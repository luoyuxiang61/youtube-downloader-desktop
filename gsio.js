const fs = require('fs')
const http = require('http')
const path = require('path')
const crypto = require('crypto')


let linkInput = document.getElementById('linkInput')
let downloadBtn = document.getElementById('downloadBtn')
let giveMeLink = document.getElementById('giveMeLink')

let progressCon = document.getElementById('progressCon')
let progress = document.getElementById('progress')
let progressTip = document.getElementById('progressTip')


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
            downloadBtn.videoSize = info.videoSize
        })
    })
})

linkInput.addEventListener('keydown', () => {
    downloadBtn.style.display = 'none'
})



downloadBtn.addEventListener('click', (evt) => {
    downloadBtn.style.display = 'none'
    progressCon.style.display = 'block'
    let videoTimeName = crypto.createHmac('sha256', new Date().toTimeString() + new Date().toDateString()).update('i love nodejs').digest('hex').substr(2, 10)
    let videoSize = parseFloat(evt.target.videoSize) * 1048576
    let videoPath = path.join(`d:/geekshine`, `${videoTimeName}.mp4`)


    fs.readdir('d:/geekshine', (err, files) => {
        if (err) {
            fs.mkdirSync('d:/geekshine')
        }
        fs.open(videoPath, 'w', (err, fd) => {
            let hashName = evt.target.hashName
            http.get({
                hostname: 'geekshine.io',
                port: 3000,
                path: `/downloadByHashName?hashName=${hashName}`
            }, (res) => {

                let size = 0;
                res.on('data', (chunk) => {
                    size += chunk.length
                    var p = Math.round((size / videoSize) * 100)
                    progress['aria - valuenow'] = p
                    progress.style.width = `${p}%`
                    progressTip.innerText = `${p}%`
                })

                res.on('end', () => {
                    progressCon.style.display = 'none'
                    alert('ok!')
                })
                res.pipe(fs.createWriteStream(videoPath))
            })
        })
    })






})
