import { errorMsg } from "../utils/messageError.js";

export class BrowserScreen {
  constructor(
    getDisplayMediaOptions = { video: true, audio: false },
    mediaRecorderOptions = {}
  ) {
    this.videoStream = null;
    this.mediaRecorder = null;
    this.recordedSlices = [];
    this.getDisplayMediaOptions = getDisplayMediaOptions;
    this.mediaRecorderOptions = mediaRecorderOptions;
  }

  streamSuccess(stream) {
    this.videoStream = stream;
    this.mediaRecord();
  }

  streamError(error) {
    errorMsg(`getDisplayMedia error: ${error.name}`, error);
  }

  startRecord() {
    this.browserSupported();
    navigator.mediaDevices
      .getDisplayMedia(this.options)
      .then((stream) => {
        this.streamSuccess(stream);
      })
      .catch((error) => {
        this.streamError(error);
      });
  }

  stopRecord() {
    return new Promise((resolve, reject) => {
      try {
        this.videoStream.getTracks().forEach((track) => track.stop());
        this.mediaRecorder.onstop = () => {
          const completeBlob = new Blob(this.recordedSlices, {
            type: this.recordedSlices[0].type,
          });
          resolve(URL.createObjectURL(completeBlob));
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  mediaRecord() {
    this.mediaRecorder = new MediaRecorder(this.videoStream, this.mediaRecorderOptions);
    this.mediaRecorder.ondataavailable = (e) =>
      this.recordedSlices.push(e.data);
    this.mediaRecorder.start();
  }

  browserSupported() {
    if (
      !navigator.mediaDevices &&
      !("getDisplayMedia" in navigator.mediaDevices)
    ) {
      errorMsg("getDisplayMedia is not supported");
    }
  }
}
