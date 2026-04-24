import React, { useEffect, useRef, useState } from 'react'

interface Props {
  audioUrl: string | null
  onTimeUpdate: (time: number) => void
  audioRef: React.MutableRefObject<HTMLAudioElement | null>
}

export default function AudioPlayer({ audioUrl, onTimeUpdate, audioRef }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!audioRef.current) return
    const audio = audioRef.current

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      onTimeUpdate(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [audioUrl, onTimeUpdate])

  useEffect(() => {
    if (!audioRef.current || !audioUrl) return
    audioRef.current.src = audioUrl
    audioRef.current.load()
    setIsPlaying(false)
    setCurrentTime(0)
  }, [audioUrl])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return
    const rect = progressRef.current.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = ratio * duration
  }

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  if (!audioUrl) return null

  return (
    <div className="audio-player">
      <audio ref={audioRef} preload="auto" />
      <div className="player-controls">
        <button className="btn btn-play" onClick={togglePlay}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <span className="time-display">{formatTime(currentTime)}</span>
        <div
          className="progress-bar"
          ref={progressRef}
          onClick={handleSeek}
        >
          <div
            className="progress-fill"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
        <span className="time-display">{formatTime(duration)}</span>
      </div>
    </div>
  )
}
