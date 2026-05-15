# Browser Screen Record

A lightweight TypeScript library for recording your browser screen using the MediaRecorder API. Perfect for creating screen capture, tutorials, or presentations directly from your web application.

## Features

- 🎥 Record browser screen with ease
- 📦 TypeScript support with full type definitions
- ⚙️ Configurable media and recorder options
- 🔧 Simple and intuitive API
- 📱 Works with modern browsers supporting the Screen Capture API

## Installation

Install the package via npm:

```bash
npm install browser-screen-record
```

Or using yarn:

```bash
yarn add browser-screen-record
```

## Usage

### Basic Example

```typescript
import BrowserScreen from 'browser-screen-record';

// Create a new instance with default options
const recorder = new BrowserScreen();

// Start recording
recorder.startRecord();

// Stop recording and get the video blob URL
const videoUrl = await recorder.stopRecord();

// Use the video URL (e.g., create a download link)
const a = document.createElement('a');
a.href = videoUrl;
a.download = 'screen-recording.webm';
a.click();
```

### Custom Configuration

You can customize the display media options and media recorder options:

```typescript
import BrowserScreen from 'browser-screen-record';

const displayMediaOptions: DisplayMediaStreamOptions = {
  video: {
    cursor: 'always' // 'always', 'motion', or 'never'
  },
  audio: false
};

const mediaRecorderOptions: MediaRecorderOptions = {
  mimeType: 'video/webm;codecs=vp9'
};

const recorder = new BrowserScreen(displayMediaOptions, mediaRecorderOptions);

recorder.startRecord();
// ... recording ...
const videoUrl = await recorder.stopRecord();
```

## API Reference

### Constructor

```typescript
new BrowserScreen(
  displayMediaOptions?: DisplayMediaStreamOptions,
  mediaRecorderOptions?: MediaRecorderOptions
)
```

**Parameters:**
- `displayMediaOptions` (optional): Configuration for `navigator.mediaDevices.getDisplayMedia()`
- `mediaRecorderOptions` (optional): Configuration for the `MediaRecorder` instance

Both parameters default to empty objects `{}` if not provided.

### Methods

#### `startRecord(): void`

Initiates the screen recording. This will prompt the user to select a screen or window to record.

```typescript
recorder.startRecord();
```

#### `stopRecord(): Promise<string>`

Stops the recording and returns a promise that resolves to a Blob URL of the recorded video.

```typescript
const videoUrl = await recorder.stopRecord();
```

### Properties

- `videoStream: MediaStream` - The current media stream
- `mediaRecorder: MediaRecorder` - The recorder instance
- `recordedSlices: Blob[]` - Array of recorded data chunks
- `displayMediaOptions: DisplayMediaStreamOptions` - Display media configuration
- `mediaRecorderOptions: MediaRecorderOptions` - Recorder configuration

## Browser Support

This library requires:
- Chrome 72+
- Firefox 66+
- Edge 79+
- Safari 13+ (macOS only)

The library includes a browser compatibility check via the `browserSupported()` method.

## Error Handling

The library handles errors gracefully:

```typescript
const recorder = new BrowserScreen();

try {
  recorder.startRecord();
  // ... later ...
  const videoUrl = await recorder.stopRecord();
} catch (error) {
  console.error('Recording failed:', error);
}
```

Common errors:
- **Permission denied**: User cancelled the screen selection dialog
- **getDisplayMedia is not supported**: Browser doesn't support the Screen Capture API
- **Stream errors**: Issues accessing the display media

## MIME Types

Common MIME types for video recording:

```typescript
// VP9 codec (best compression, wider support)
'video/webm;codecs=vp9'

// VP8 codec (good compression, good support)
'video/webm;codecs=vp8'

// H.264 codec (better compatibility)
'video/mp4;codecs=h264'
```

## TypeScript Support

This library is written in TypeScript and includes full type definitions. All types are automatically imported:

```typescript
import BrowserScreen from 'browser-screen-record';

const recorder = new BrowserScreen();
```

## License

MIT

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.