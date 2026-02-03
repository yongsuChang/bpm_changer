import { useState, ChangeEvent, useRef, DragEvent } from 'react'
import axios from 'axios'
import './index.css' // Ensure styles are loaded

interface AnalysisResult {
  filename: string
  duration: number
  bpm: number
  size: number
}

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [converting, setConverting] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isWaltz, setIsWaltz] = useState(false)
  const [targetBpm, setTargetBpm] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const previewUrl = file ? URL.createObjectURL(file) : null

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  // --- Handlers ---

  const processFile = (selectedFile: File) => {
    // Basic validation
    if (!selectedFile.type.startsWith('audio/')) {
      setError('Please upload an audio file.')
      return
    }
    setFile(selectedFile)
    setResult(null)
    setError(null)
    setTargetBpm('')
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(response.data)
      setTargetBpm(response.data.bpm.toFixed(0))
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.detail || 'An error occurred during analysis. Ensure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleConvert = async () => {
    if (!file || !result || !targetBpm) return

    setConverting(true)
    setError(null)
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('original_bpm', result.bpm.toString())
    formData.append('target_bpm', targetBpm)

    try {
      const response = await axios.post(`${API_URL}/convert`, formData, {
        responseType: 'blob',
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      
      const contentDisposition = response.headers['content-disposition']
      let filename = `${file.name.split('.')[0]}_${targetBpm}bpm.${file.name.split('.').pop()}`
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/)
        if (match) filename = match[1]
      }
      
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err: any) {
      console.error(err)
      setError('An error occurred during conversion.')
    } finally {
      setConverting(false)
    }
  }

  const handleReset = () => {
    if (window.confirm("Are you sure? This will clear the current analysis.")) {
      setFile(null)
      setResult(null)
      setTargetBpm('')
      setError(null)
      setIsWaltz(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const displayedBpm = result ? (isWaltz ? (result.bpm * 3) / 4 : result.bpm) : 0

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      padding: '20px'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '600px', 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        padding: '30px'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c3e50', marginTop: 0 }}>
          🎵 BPM Changer
        </h1>
        
        {!result && (
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{ 
              border: `2px dashed ${isDragging ? '#007bff' : '#cbd5e0'}`, 
              backgroundColor: isDragging ? '#ebf8ff' : '#f8f9fa',
              padding: '40px 20px', 
              textAlign: 'center', 
              borderRadius: '12px', 
              marginBottom: '20px',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            <input 
              type="file" 
              accept="audio/*" 
              onChange={handleFileChange} 
              ref={fileInputRef}
              id="file-upload"
              style={{ display: 'none' }}
            />
            
            {file ? (
              <div style={{ marginBottom: '20px' }}>
                 <p style={{ fontWeight: 'bold', fontSize: '1.1em' }}>📄 {file.name}</p>
                 <p style={{ color: '#666', fontSize: '0.9em' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div onClick={() => fileInputRef.current?.click()} style={{ padding: '20px' }}>
                <p style={{ fontSize: '3em', margin: 0 }}>📂</p>
                <p style={{ fontSize: '1.1em', fontWeight: '500', color: '#4a5568' }}>
                  Click to upload or drag & drop
                </p>
                <p style={{ fontSize: '0.9em', color: '#a0aec0' }}>MP3, WAV, OGG (Max 20MB)</p>
              </div>
            )}

            {file && (
              <button 
                onClick={handleUpload} 
                disabled={loading}
                style={{ 
                  padding: '12px 30px', 
                  cursor: loading ? 'not-allowed' : 'pointer', 
                  backgroundColor: '#007bff', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '30px',
                  fontSize: '16px',
                  fontWeight: '600',
                  boxShadow: '0 4px 6px rgba(0,123,255,0.2)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading && <span className="spinner"></span>}
                {loading ? 'Analyzing...' : 'Analyze Audio'}
              </button>
            )}
          </div>
        )}

        {error && (
          <div style={{ 
            color: '#721c24', 
            backgroundColor: '#f8d7da', 
            borderColor: '#f5c6cb', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '0.95em'
          }}>
            ⚠️ {error}
          </div>
        )}

        {result && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            {previewUrl && (
              <div style={{ marginBottom: '25px', textAlign: 'center', background: '#f1f3f5', padding: '15px', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '0.9em', textTransform: 'uppercase', letterSpacing: '1px' }}>Original Preview</h4>
                <audio ref={audioRef} src={previewUrl} controls style={{ width: '100%', outline: 'none' }} />
              </div>
            )}

            <div style={{ background: '#fff', border: '1px solid #e9ecef', padding: '25px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <h3 style={{ marginTop: 0, color: '#343a40', borderBottom: '2px solid #007bff', paddingBottom: '10px', display: 'inline-block' }}>Analysis Result</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.85em', color: '#868e96' }}>DURATION</span>
                  <span style={{ fontWeight: '500', fontSize: '1.1em' }}>{Math.floor(result.duration / 60)}:{(result.duration % 60).toFixed(0).padStart(2, '0')}</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.85em', color: '#868e96' }}>BPM</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.4em', color: '#007bff' }}>{result.bpm.toFixed(2)}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                       <button 
                         onClick={() => {
                           setResult({ ...result, bpm: result.bpm / 2 })
                           // If target wasn't manually set yet, maybe update it too? let's keep it simple for now.
                         }}
                         title="Halve BPM"
                         style={{ padding: '2px 8px', fontSize: '0.7em', background: '#e9ecef', color: '#495057', border: '1px solid #ced4da' }}
                       >
                         ½
                       </button>
                       <button 
                         onClick={() => setResult({ ...result, bpm: result.bpm * 2 })}
                         title="Double BPM"
                         style={{ padding: '2px 8px', fontSize: '0.7em', background: '#e9ecef', color: '#495057', border: '1px solid #ced4da' }}
                       >
                         2x
                       </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: '20px', padding: '12px', background: '#e3f2fd', borderRadius: '8px', border: '1px solid #bbdefb' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}>
                  <input 
                    type="checkbox" 
                    checked={isWaltz} 
                    onChange={(e) => setIsWaltz(e.target.checked)} 
                    style={{ marginRight: '10px', width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ color: '#1565c0', fontWeight: '500' }}>Waltz Mode (3/4 or 6/8)</span>
                </label>
                {isWaltz && (
                  <div style={{ marginTop: '8px', marginLeft: '28px', color: '#0d47a1', fontSize: '0.95em' }}>
                    Adjusted Display BPM: <strong>{displayedBpm.toFixed(2)}</strong>
                  </div>
                )}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '25px' }}>
              <h4 style={{ marginTop: 0, color: '#495057' }}>Change BPM & Download</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85em', color: '#666', fontWeight: '600' }}>TARGET BPM</label>
                  <input 
                    type="number" 
                    value={targetBpm} 
                    onChange={(e) => setTargetBpm(e.target.value)}
                    disabled={converting}
                    placeholder="e.g. 120"
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      borderRadius: '8px', 
                      border: '1px solid #ced4da', 
                      fontSize: '1.1em',
                      backgroundColor: converting ? '#e9ecef' : 'white'
                    }} 
                  />
                </div>
                <button 
                  onClick={handleConvert} 
                  disabled={converting || !targetBpm}
                  style={{ 
                    flex: 2,
                    marginTop: '24px',
                    padding: '12px 15px', 
                    cursor: (converting || !targetBpm) ? 'not-allowed' : 'pointer', 
                    backgroundColor: '#28a745', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: (converting || !targetBpm) ? 0.6 : 1,
                    transition: 'background-color 0.2s'
                  }}
                >
                  {converting ? <><span className="spinner" style={{ borderColor: 'white', borderLeftColor: 'transparent', width: '18px', height: '18px', borderWidth: '3px' }}></span> Converting...</> : 'Convert & Download'}
                </button>
              </div>
            </div>

            <div style={{ marginTop: '40px', textAlign: 'center' }}>
               <button 
                onClick={handleReset}
                disabled={converting}
                style={{
                  background: 'none',
                  border: '1px solid #dc3545',
                  color: '#dc3545',
                  padding: '8px 25px',
                  borderRadius: '20px',
                  cursor: converting ? 'not-allowed' : 'pointer',
                  fontSize: '0.9em',
                  fontWeight: '500',
                  opacity: converting ? 0.5 : 1
                }}
               >
                 ↺ Upload New File
               </button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default App