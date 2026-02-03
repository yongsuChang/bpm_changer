# BPM Changer Project Plan

## 1. Project Goal
Develop a web-based service that allows users to analyze and change the BPM (tempo) of music files.

## 2. Core Features
1.  **File Upload:**
    *   [x] Accept audio files (MP3, WAV, etc.) from the user.
    *   [x] Validation: File size limit (20MB).
2.  **Audio Analysis:**
    *   [x] Extract Metadata: Title, Duration, File Size.
    *   [x] BPM Detection: Analyze and display the original BPM.
    *   [x] **Time Signature Handling:** Checkbox to toggle between standard and Waltz interpretation.
3.  **Preview:**
    *   [x] Browser-based audio player to listen to the uploaded file.
4.  **BPM Modification & Download:**
    *   [x] Input field for desired Target BPM.
    *   [x] Backend processing to change tempo without altering pitch (Time-stretching).
    *   [x] Download processed file with BPM suffix.

## 3. Tech Stack

### Frontend
*   **Framework:** React (via Vite)
*   **Styling:** Custom CSS (centered, responsive-ish)
*   **State Management:** React local state
*   **HTTP Client:** Axios

### Backend
*   **Framework:** FastAPI (Python)
*   **Audio Processing:** `librosa`, `soundfile`
*   **Utilities:** `starlette` (BackgroundTasks for cleanup)

## 4. Development Phases

### Phase 1: Setup & Scaffolding
*   [x] Initialize Git repo (Done).
*   [x] Create directory structure (`backend/`, `frontend/`).
*   [x] Setup Docker environment (Dockerfile for Backend/Frontend, docker-compose.yml).
*   [x] Setup React project with Vite.

### Phase 2: Backend Core (Analysis)
*   [x] Implement file upload endpoint (with size check).
*   [x] Implement `analyze` endpoint (returns BPM, duration, metadata).
*   [x] Add logic for Time Signature (implemented on frontend).

### Phase 3: Backend Core (Processing)
*   [x] Implement `convert` endpoint.
    *   [x] Input: file, original_bpm, target_bpm.
    *   [x] Process: Time-stretch audio.
    *   [x] Output: File stream with BackgroundTask cleanup.

### Phase 4: Frontend UI
*   [x] Create Upload Component (Drag & Drop).
*   [x] Build "Analysis Result" card (BPM display, Players).
*   [x] Build "Converter" controls (Target BPM input, Download button).
*   [x] Integrate with Backend APIs.
*   [x] Add BPM manual correction (Half/Double).

### Phase 5: Polishing & Deployment Prep
*   [x] Error handling (client-side and server-side).
*   [x] Loading states (spinners during upload/processing).
*   [x] Layout centering and UI cleanup.

## 5. Constraints & Constants
*   **MAX_FILE_SIZE:** 20 MB (defined in backend/docker-compose).
*   **SUPPORTED_FORMATS:** .mp3, .wav, .ogg.