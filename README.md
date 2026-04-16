# 🎵 BPM Changer

BPM Changer is a powerful web application that allows users to analyze the tempo (BPM) of audio files and modify it to a target BPM without altering the pitch (time-stretching). It now supports extracting audio directly from video links (like YouTube) and offers advanced editing features like custom trimming and fade-out effects.

## ✨ Features

- **Dual Input Modes**:
  - **File Upload**: Upload local MP3, WAV, or OGG files (up to 20MB).
  - **Video Link**: Paste a YouTube or other video link to automatically extract and analyze its audio.
- **Audio Analysis**:
  - Automatically detects BPM, duration, and file metadata.
  - **Waltz Mode**: Toggle between standard and 3/4 or 6/8 time signature interpretations.
  - **Manual Correction**: Quickly halve (½) or double (2x) the detected BPM.
- **Advanced Processing**:
  - **BPM Conversion**: Change playback speed while maintaining the original pitch.
  - **Custom Trimming**: Specify a target duration in minutes and seconds to trim the output.
  - **5s Fade-out**: Optional 5-second volume fade-out at the end of the track for a smooth finish.
- **Instant Download**: Processed files are generated on-the-fly and cleaned up automatically from the server after download.

## 🛠 Tech Stack

### Backend
- **Language**: Python 3.10
- **Framework**: FastAPI
- **Audio Processing**: Librosa, SoundFile, NumPy
- **Extraction**: yt-dlp, FFmpeg
- **Server**: Uvicorn

### Frontend
- **Framework**: React (TypeScript)
- **Build Tool**: Vite
- **Styling**: Custom CSS (Responsive & Modern)
- **HTTP Client**: Axios

## 🚀 Getting Started

### Option 1: Using Docker (Recommended)

The easiest way to run the application is using Docker Compose.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yongsuChang/bpm_changer.git
    cd bpm_changer
    ```

2.  **Start the services**:
    ```bash
    docker compose up --build -d
    ```

3.  **Access the application**:
    - **Frontend**: [http://localhost:5173](http://localhost:5173)
    - **Backend API**: [http://localhost:8000](http://localhost:8000)

4.  **Stop the application**:
    ```bash
    docker compose down
    ```

### Option 2: Running Locally

#### Prerequisites
- **FFmpeg**: Required for audio processing and link extraction.
- **Node.js** (v18+) & **pnpm**.
- **Python** (v3.10+).

#### Backend Setup
1. `cd backend`
2. `pip install -r requirements.txt`
3. `uvicorn main:app --reload`

#### Frontend Setup
1. `cd frontend`
2. `pnpm install`
3. `pnpm dev`

## 📖 Usage

1.  **Import Audio**: Select the "Upload File" tab to use a local file, or "Video Link" to paste a YouTube URL.
2.  **Analyze**: Click "Analyze" to detect the BPM and duration.
3.  **Customize**:
    - Enter your **Target BPM**.
    - Set the **Target Length** (Min:Sec) if you wish to trim the file.
    - Check **Apply 5s Fade-out** for a smooth ending.
4.  **Process**: Click "Convert & Download". The app will process your request and trigger a download of the modified audio file.

## 📝 Environment Variables

- **Backend**:
  - `MAX_FILE_SIZE`: Maximum allowed file size in bytes (default: 20MB).
- **Frontend**:
  - `VITE_API_URL`: Backend API URL (default: `http://localhost:8000`).

## ⚖️ License

[MIT](LICENSE)
