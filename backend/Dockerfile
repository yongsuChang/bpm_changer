FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for audio processing
# libsndfile1: required by soundfile/librosa
# ffmpeg: required for loading mp3/various formats
RUN apt-get update && apt-get install -y \
    libsndfile1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

