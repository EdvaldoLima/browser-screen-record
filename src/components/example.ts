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

const start = shadow.querySelector("#start") as HTMLButtonElement;
const stop = shadow.querySelector("#stop") as HTMLButtonElement;

if (!start || !stop) {
  throw new Error("Required elements not found in DOM");
}

const screen = new BrowserScreen();

start.addEventListener("click", () => {
  screen.startRecord();
});

stop.addEventListener("click", () => {
  screen.stopRecord().then(blobURL => {
    const url = String(blobURL);
    const video = shadow.querySelector<HTMLVideoElement>("#preview");
    const link = shadow.querySelector<HTMLAnchorElement>("#download");
    
    if (!video || !link) {
      throw new Error("Video elements not found");
    }
    
    link.setAttribute("href", url);
    video.setAttribute("src", url);
    video.play();
  }).catch(() => {
    // Handle error silently
  });
});

export default example;
