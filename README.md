# browser screen record

```html

  <video id="preview" width="300px" autoplay></video> <br>
  <a id="download" download="file.webm">Download</a> <br> <br>
  <button id="start">start</button>
  <button id="stop">stop</button>

```

```js
import BrowserScreen from 'browser-screen-record'

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

// Important! Use URL.revokeObjectURL(blobURL) after download
```