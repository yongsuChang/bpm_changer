import os
import shutil
import tempfile
import librosa
import soundfile as sf
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from starlette.background import BackgroundTask
from pydantic import BaseModel

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 20 * 1024 * 1024)) # Default 20MB

class AnalysisResult(BaseModel):
    filename: str
    duration: float
    bpm: float
    size: int

def remove_file(path: str):
    try:
        if os.path.exists(path):
            os.remove(path)
    except Exception as e:
        print(f"Error removing file {path}: {e}")

@app.get("/")
def read_root():
    return {"Hello": "World", "Service": "BPM Changer API"}

@app.post("/analyze", response_model=AnalysisResult)
async def analyze_audio(file: UploadFile = File(...)):
    content = await file.read()
    file_size = len(content)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail=f"File too large. Max size is {MAX_FILE_SIZE / 1024 / 1024}MB")

    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        tmp.write(content)
        tmp_path = tmp.name

    try:
        y, sr = librosa.load(tmp_path, sr=None)
        duration = librosa.get_duration(y=y, sr=sr)
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        bpm = float(tempo[0]) if hasattr(tempo, "__len__") else float(tempo)

        return AnalysisResult(
            filename=file.filename,
            duration=round(duration, 2),
            bpm=round(bpm, 2),
            size=file_size
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing audio: {str(e)}")
    finally:
        remove_file(tmp_path)

@app.post("/convert")
async def convert_audio(
    file: UploadFile = File(...),
    original_bpm: float = Form(...),
    target_bpm: float = Form(...)
):
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large")

    suffix = os.path.splitext(file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_in:
        tmp_in.write(content)
        tmp_in_path = tmp_in.name

    tmp_out_path = ""

    try:
        y, sr = librosa.load(tmp_in_path, sr=None)
        
        rate = target_bpm / original_bpm
        y_stretched = librosa.effects.time_stretch(y=y, rate=rate)
        
        output_filename = f"{os.path.splitext(file.filename)[0]}_{int(target_bpm)}bpm{suffix}"
        tmp_out_path = tempfile.mktemp(suffix=suffix)
        sf.write(tmp_out_path, y_stretched, sr)

        return FileResponse(
            path=tmp_out_path,
            filename=output_filename,
            media_type="audio/mpeg" if suffix == ".mp3" else "audio/wav",
            background=BackgroundTask(remove_file, tmp_out_path)
        )
    except Exception as e:
        if tmp_out_path and os.path.exists(tmp_out_path): remove_file(tmp_out_path)
        raise HTTPException(status_code=400, detail=f"Conversion error: {str(e)}")
    finally:
        remove_file(tmp_in_path)
