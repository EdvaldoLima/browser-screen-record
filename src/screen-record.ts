import { messageError } from "../utils/messageError.js";

export class BrowserScreen {
  videoStream: MediaStream;
  mediaRecorder: MediaRecorder;
  recordedSlices: Array<Blob>;
  displayMediaOptions: DisplayMediaStreamOptions;
  mediaRecorderOptions: MediaRecorderOptions;

  constructor(
    displayMediaOptions: DisplayMediaStreamOptions,
    mediaRecorderOptions: MediaRecorderOptions
  ) {
    this.videoStream = {} as MediaStream;
    this.mediaRecorder = {} as MediaRecorder;
    this.recordedSlices = [];
    this.displayMediaOptions = displayMediaOptions;
    this.mediaRecorderOptions = mediaRecorderOptions;
  }

  streamSuccess(stream: MediaStream): void {
    this.videoStream = stream;
    this.mediaRecord();
  }

  streamError(error: ErrorCallback): void {
    messageError(`getDisplayMedia error: ${error.name}`, error);
  }

  startRecord(): void {
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

  stopRecord(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      try {
        this.videoStream
          .getTracks()
          .forEach((track: MediaStreamTrack) => track.stop());
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

  mediaRecord(): void {
    this.mediaRecorder = new MediaRecorder(
      this.videoStream,
      this.mediaRecorderOptions
    );
    this.mediaRecorder.ondataavailable = (event: BlobEvent) =>
      this.recordedSlices.push(event.data);
    this.mediaRecorder.start();
  }

  browserSupported(): boolean {
    if (
      !navigator.mediaDevices &&
      !("getDisplayMedia" in navigator.mediaDevices)
    ) {
      messageError("getDisplayMedia is not supported");
      return false;
    }

    return true;
  }
}
