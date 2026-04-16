import os
import tempfile
import librosa
import numpy as np
import soundfile as sf
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from starlette.background import BackgroundTask
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

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

def process_audio_logic(y, sr, original_bpm, target_bpm, target_duration=None, fade_out=False):
    rate = target_bpm / original_bpm
    y_processed = librosa.effects.time_stretch(y=y, rate=rate)
    if target_duration is not None and target_duration > 0:
        target_samples = int(target_duration * sr)
        y_processed = y_processed[:target_samples]
    if fade_out:
        fade_len = int(5 * sr)
        if len(y_processed) > fade_len:
            fade_curve = np.linspace(1.0, 0.0, fade_len)
            y_processed[-fade_len:] *= fade_curve
        elif len(y_processed) > 0:
            fade_curve = np.linspace(1.0, 0.0, len(y_processed))
            y_processed *= fade_curve
    return y_processed

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
    target_bpm: float = Form(...),
    target_duration: Optional[float] = Form(None),
    fade_out: bool = Form(False)
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
        y_processed = process_audio_logic(y, sr, original_bpm, target_bpm, target_duration, fade_out)
        output_filename = f"{os.path.splitext(file.filename)[0]}_{int(target_bpm)}bpm{suffix}"
        tmp_out_path = tempfile.mktemp(suffix=suffix)
        sf.write(tmp_out_path, y_processed, sr)
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
