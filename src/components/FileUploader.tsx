import React from 'react'
import type { AudioFile } from '../types'

interface Props {
  audioFile: AudioFile | null
  onFileLoaded: (file: AudioFile) => void
}

export default function FileUploader({ audioFile, onFileLoaded }: Props) {
  const handleOpenFile = async () => {
    const result = await window.electronAPI.openFile()
    if (!result) return

    const blob = new Blob([result.buffer], { type: 'audio/mpeg' })
    const url = URL.createObjectURL(blob)

    onFileLoaded({
      name: result.name,
      path: result.path,
      url,
    })
  }

  return (
    <div className="file-uploader">
      {audioFile ? (
        <div className="file-info">
          <span className="file-icon">🎵</span>
          <span className="file-name">{audioFile.name}</span>
          <button className="btn btn-sm" onClick={handleOpenFile}>
            更换文件
          </button>
        </div>
      ) : (
        <button className="btn btn-primary btn-large" onClick={handleOpenFile}>
          选择音频文件
        </button>
      )}
    </div>
  )
}
