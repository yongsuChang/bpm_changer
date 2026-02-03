# BPM Changer Project Plan

## 1. Project Goal
Develop a web-based service that allows users to analyze and change the BPM (tempo) of music files.

## 2. Core Features
1.  **File Upload:**
    *   Accept audio files (MP3, WAV, etc.) from the user.
    *   Validation: File size limit (e.g., < 20MB, configurable constant).
2.  **Audio Analysis:**
    *   Extract Metadata: Title, Duration, File Size.
    *   BPM Detection: Analyze and display the original BPM.
    *   **Time Signature Handling:** Checkbox to toggle between standard (4/4) and Waltz (3/4, 6/8) interpretation (adjusts displayed BPM if needed).
3.  **Preview:**
    *   Browser-based audio player to listen to the uploaded file.
4.  **BPM Modification & Download:**
    *   Input field for desired Target BPM.
    *   Backend processing to change tempo without altering pitch (Time-stretching).
    *   Download processed file (Filename format: `{OriginalTitle}_bpm{NewBPM}.{ext}`).

## 3. Tech Stack

### Frontend
*   **Framework:** React (via Vite)
*   **Styling:** Tailwind CSS (for rapid UI development)
*   **State Management:** React Context or local state (sufficient for this scale)
*   **HTTP Client:** Axios or Fetch API

### Backend
*   **Framework:** FastAPI (Python) - High performance, easy async handling.
*   **Audio Processing:**
    *   `librosa`: For BPM analysis and loading audio data.
    *   `soundfile`: For saving processed audio.
    *   `pyrubberband` (requires `rubberband-cli`): High-quality time-stretching (tempo change without pitch shift). Alternatively `librosa`'s time_stretch (lower quality but easier dependency) or `ffmpeg`. *Decision: Start with rubberband for quality, fallback to librosa/ffmpeg if deployment is too complex.*
*   **Utilities:** `pydantic` for data validation.

## 4. Development Phases

### Phase 1: Setup & Scaffolding
*   [ ] Initialize Git repo (Done).
*   [ ] Create directory structure (`backend/`, `frontend/`).
*   [ ] Setup Docker environment (Dockerfile for Backend/Frontend, docker-compose.yml).
*   [ ] Setup React project with Vite.

### Phase 2: Backend Core (Analysis)
*   [x] Implement file upload endpoint (with size check).
*   [x] Implement `analyze` endpoint (returns BPM, duration, metadata).
*   [ ] Add logic for Time Signature (simply math on the frontend or backend suggestion).

### Phase 3: Backend Core (Processing)
*   [x] Implement `convert` endpoint.
    *   [x] Input: file_id, target_bpm.
    *   [x] Process: Time-stretch audio.
    *   [x] Output: File stream or download link.

### Phase 4: Frontend UI
*   [x] Create Upload Component (Basic).
*   [x] Build "Analysis Result" card (BPM display, Players).
*   [x] Build "Converter" controls (Target BPM input, Download button).
*   [ ] Integrate with Backend APIs (Completed).

### Phase 5: Polishing & Deployment Prep
*   [ ] Error handling (invalid files, server errors).
*   [ ] Loading states (spinners during upload/processing).

## 5. Constraints & Constants
*   **MAX_FILE_SIZE:** 20 MB (defined in backend config).
*   **SUPPORTED_FORMATS:** .mp3, .wav, .ogg.
