# BPM Changer

BPM Changer is a web application that allows users to analyze the tempo (BPM) of audio files and change it to a target BPM without altering the pitch (time-stretching).

## Features

- **Audio Analysis**: Upload an audio file to automatically detect its BPM, duration, and file size.
- **BPM Conversion**: Change the playback speed (tempo) of the audio to match a specific target BPM.
- **Download**: Download the processed audio file.
- **File Support**: Supports common audio formats (MP3, WAV).

## Tech Stack

### Backend
- **Language**: Python 3.9+
- **Framework**: FastAPI
- **Audio Processing**: Librosa, SoundFile
- **Server**: Uvicorn

### Frontend
- **Framework**: React (w/ TypeScript)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm

## Prerequisites

- **Docker** and **Docker Compose** (recommended for easiest setup)
- **Node.js** (v18+) and **pnpm** (if running frontend locally)
- **Python** (v3.9+) (if running backend locally)

## Getting Started

### Option 1: Using Docker (Recommended)

The easiest way to run the application is using Docker Compose.

1.  Clone the repository:
    ```bash
    # Using HTTPS
    git clone https://github.com/yongsuChang/bpm_changer.git
    
    # OR Using SSH
    git clone git@github.com:yongsuChang/bpm_changer.git

    cd bpm_changer
    ```

2.  Start the services:
    ```bash
    # Run in detached mode (background)
    docker compose up --build -d
    ```

3.  Access the application:
    -   **Frontend**: [http://localhost:5173](http://localhost:5173)
    -   **Backend API**: [http://localhost:8000](http://localhost:8000)
    -   **API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

4.  Stop the application:
    To stop the running services and remove the containers:
    ```bash
    docker compose down
    ```

### Option 2: Running Locally

If you prefer to run the services without Docker, follow these steps.

#### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Create a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Start the backend server:
    ```bash
    uvicorn main:app --reload
    ```
    The backend will start at `http://localhost:8000`.

#### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    pnpm install
    ```

3.  Start the development server:
    ```bash
    pnpm dev
    ```
    The frontend will start at `http://localhost:5173`.

## Usage

1.  Open the web interface at [http://localhost:5173](http://localhost:5173).
2.  Upload an audio file (max 20MB by default).
3.  View the detected BPM.
4.  Enter a new target BPM.
5.  Click "Convert" to process and download the new audio file.

## Environment Variables

You can configure the application using environment variables.

**Backend:**
- `MAX_FILE_SIZE`: Maximum allowed file size in bytes (default: 20MB).

**Frontend:**
- `VITE_API_URL`: The URL of the backend API (default: `http://localhost:8000`).

## License

[MIT](LICENSE)