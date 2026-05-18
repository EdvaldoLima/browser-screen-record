import { messageError } from "./utils/messageError";

export default class BrowserScreen {
  videoStream: MediaStream | null;
  mediaRecorder: MediaRecorder | null;
  recordedSlices: Array<Blob>;
  displayMediaOptions: DisplayMediaStreamOptions;
  mediaRecorderOptions: MediaRecorderOptions;

  constructor(
    displayMediaOptions: DisplayMediaStreamOptions = {},
    mediaRecorderOptions: MediaRecorderOptions = {}
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

  streamError(error: DOMException | Error): void {
    messageError(`getDisplayMedia error: ${error.name}`, error);
  }

  startRecord(): void {
    this.browserSupported();
    navigator.mediaDevices
      .getDisplayMedia(this.displayMediaOptions)
      .then((stream) => {
        this.handleAudio(stream);
      })
      .catch((error) => {
        this.streamError(error);
      });
  }

  async handleAudio(videoStream: MediaStream): Promise<void> {
    try {
      if (this.displayMediaOptions.audio) {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        
        audioStream.getAudioTracks().forEach((track) => {
          videoStream.addTrack(track);
        });
      }
      
      this.streamSuccess(videoStream);
    } catch (error) {
      this.streamError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  stopRecord(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        if (!this.videoStream || !this.mediaRecorder) {
          throw new Error("Recorder was not initialized");
        }

        const timeout = setTimeout(() => {
          reject(new Error("Timeout: recording did not finish"));
        }, 5000);

        this.videoStream
          .getTracks()
          .forEach((track: MediaStreamTrack) => track.stop());

        this.mediaRecorder.onstop = () => {
          clearTimeout(timeout);

          if (this.recordedSlices.length === 0) {
            reject(new Error("No data was recorded"));
            return;
          }

          const type = this.recordedSlices[0].type || 'video/webm';
          const completeBlob = new Blob(this.recordedSlices, { type });
          resolve(URL.createObjectURL(completeBlob));
        };

        this.mediaRecorder.stop();
      } catch (error) {
        reject(error);
      }
    });
  }

  mediaRecord(): void {
    if (!this.videoStream) {
      throw new Error("Video stream was not initialized");
    }

    if (this.mediaRecorder?.state === 'recording') {
      return;
    }

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
      !navigator.mediaDevices ||
      !("getDisplayMedia" in navigator.mediaDevices)
    ) {
      messageError("getDisplayMedia is not supported");
      return false;
    }

    return true;
  }
}
