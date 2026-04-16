# 🎵 BPM Changer

BPM Changer is a powerful web application that allows users to analyze the tempo (BPM) of audio files and modify it to a target BPM without altering the pitch (time-stretching). It features advanced editing options like custom trimming and fade-out effects.

## ✨ Features

- **Audio Analysis**: Automatic BPM detection & manual correction (½, 2x).
- **BPM Conversion**: Change playback speed while maintaining original pitch.
- **Custom Trimming**: Specify a target duration in minutes and seconds to trim the output.
- **5s Fade-out**: Optional 5-second volume fade-out at the end of the track.
- **Waltz Mode**: Support for 3/4 or 6/8 time signatures.

## 🛠 Prerequisites (OS Specific Setup)

Before running the app locally, ensure you have **Python 3.10+**, **Node.js 18+**, and **FFmpeg** installed.

### 🍎 macOS
```bash
brew install python ffmpeg node corepack
corepack enable pnpm
```

### 🐧 Ubuntu/Linux
```bash
sudo apt update
sudo apt install python3 python3-pip ffmpeg
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20
npm install -g pnpm
```

### 🪟 Windows
1. **Python**: Install from [python.org](https://www.python.org/).
2. **FFmpeg**: Download from [gyan.dev](https://www.gyan.dev/ffmpeg/builds/) and add to PATH.
3. **Node.js**: Install from [nodejs.org](https://nodejs.org/).
4. **pnpm**: Run `npm install -g pnpm`.

---

## 🚀 Getting Started

### Option 1: Using Docker (Recommended)
```bash
docker compose up --build -d
# To stop:
docker compose down
```

### Option 2: Local Development (Makefile)
```bash
# 1. Install all dependencies
make install

# 2. Run Backend and Frontend concurrently
make dev
```
- **Backend**: http://localhost:8000
- **Frontend**: http://localhost:5173

## 📖 Usage

1. **Upload**: Drag & drop or click to upload an audio file (MP3, WAV, OGG).
2. **Analyze**: View the detected BPM and original duration.
3. **Customize**: Set **Target BPM**, **Target Length**, and **Fade-out** options.
4. **Process**: Click "Convert & Download".

## ⚖️ License
[MIT](LICENSE)
