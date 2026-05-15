import BrowserScreen from "../screen-record";

const example = document.createElement("div");

const shadow = example.attachShadow({ mode: "open" });

shadow.innerHTML = `
  <video id="preview" width="300px" autoplay></video> <br />
  <a id="download" download="file.webm">Download</a> <br />
  <br />
  <button id="start">start</button>
  <button id="stop">stop</button>
`;

const start = shadow.querySelector("#start")
const stop = shadow.querySelector("#stop")

const screen = new BrowserScreen()

start?.addEventListener("click", () => {
  screen.startRecord()
})

stop?.addEventListener("click", () => {
  screen.stopRecord().then(blobURL => {
    const url = String(blobURL)
    const video = shadow.querySelector<HTMLVideoElement>("#preview")
    const link = shadow.querySelector("#download")
    link?.setAttribute("href", url)
    video?.setAttribute("src", url)
    video?.play()
  });
})

export default example;
