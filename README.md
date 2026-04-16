# 🎵 BPM Changer

BPM Changer is a powerful web application that allows users to analyze the tempo (BPM) of audio files and modify it to a target BPM without altering the pitch (time-stretching). It now supports extracting audio directly from video links (like YouTube) and offers advanced editing features like custom trimming and fade-out effects.

## ✨ Features

- **Dual Input Modes**: File Upload & Video Link (YouTube, etc.).
- **Audio Analysis**: Automatic BPM detection & manual correction (½, 2x).
- **Advanced Processing**: Time-stretching, Custom Trimming, and 5s Fade-out.
- **Waltz Mode**: Support for 3/4 or 6/8 time signatures.

## 🛠 Prerequisites (OS Specific Setup)

Before running the app locally, ensure you have **Python 3.10+**, **Node.js 18+**, and **FFmpeg** installed.

### 🍎 macOS
```bash
# Using Homebrew
brew install python ffmpeg node corepack
corepack enable pnpm
```

### 🐧 Ubuntu/Linux
```bash
sudo apt update
sudo apt install python3 python3-pip ffmpeg
# Install Node.js (via nvm recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20
npm install -g pnpm
```

### 🪟 Windows
1.  **Python**: Install from [python.org](https://www.python.org/) (Check 'Add to PATH').
2.  **FFmpeg**: Download from [gyan.dev](https://www.gyan.dev/ffmpeg/builds/) and add the `bin` folder to your System PATH.
3.  **Node.js**: Install from [nodejs.org](https://nodejs.org/).
4.  **pnpm**: Run `npm install -g pnpm` in PowerShell.

---

## 🚀 Getting Started

### Option 1: Using Docker (Recommended)
```bash
docker compose up --build -d
# To stop:
docker compose down
```

### Option 2: Local Development (Makefile)
If you have the prerequisites installed:
```bash
# 1. Install all dependencies
make install

# 2. Run Backend and Frontend concurrently
make dev
```
- **Backend**: http://localhost:8000
- **Frontend**: http://localhost:5173
- Press `Ctrl + C` to stop both servers.

## 📖 Usage

1.  **Import Audio**: Select "Upload File" or "Video Link".
2.  **Analyze**: Click "Analyze" to detect BPM.
3.  **Customize**: Set **Target BPM**, **Target Length**, and **Fade-out** options.
4.  **Process**: Click "Convert & Download".

## ⚖️ License
[MIT](LICENSE)
