import { errorMsg } from "../utils/messageError.js";

export class BrowserScreen {
  videoStream: MediaStream | any
  mediaRecorder: MediaRecorder | any
  recordedSlices: Array<any>
  displayMediaOptions: DisplayMediaStreamOptions
  mediaRecorderOptions: MediaRecorderOptions

  constructor(
    displayMediaOptions: DisplayMediaStreamOptions,
    mediaRecorderOptions: MediaRecorderOptions
  ) {
    this.videoStream = null;
    this.mediaRecorder = null;
    this.recordedSlices = [];
    this.displayMediaOptions = displayMediaOptions;
    this.mediaRecorderOptions = mediaRecorderOptions;
  }

  streamSuccess(stream: MediaStream): void {
    this.videoStream = stream;
    this.mediaRecord();
  }

  streamError(error: ErrorCallback) {
    errorMsg(`getDisplayMedia error: ${error.name}`, error);
  }

  startRecord() {
    this.browserSupported();
    navigator.mediaDevices
      .getDisplayMedia(this.displayMediaOptions)
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
        this.videoStream?.getTracks().forEach((track: any) => track.stop());
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
    this.mediaRecorder = new MediaRecorder(
      this.videoStream,
      this.mediaRecorderOptions
    );
    this.mediaRecorder.ondataavailable = (event: any) => this.recordedSlices.push(event.data);
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
