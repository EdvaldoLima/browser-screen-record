import { BrowserScreen } from '../src/screen-record.js'

const screen = new BrowserScreen()

const start = document.querySelector("#start")
const stop = document.querySelector("#stop")

start.addEventListener("click", () => {
  screen.startRecord()
})

stop.addEventListener("click", () => {
  screen.stopRecord().then(blobURL => {
    const video = document.querySelector("#preview")
    const link = document.querySelector("#download")
    link.href = blobURL
    video.src = blobURL
    video.play()
  });
})