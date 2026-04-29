import React, { useState, useRef, useCallback, useEffect } from 'react'
import FileUploader from './components/FileUploader'
import AudioPlayer from './components/AudioPlayer'
import LyricsEditor, { type EditorMode } from './components/LyricsEditor'
import Settings from './components/Settings'
import { formatLyrics } from './services/ai'
import { generateLrc } from './services/lrc'
import type { AudioFile, LyricLine, AppSettings } from './types'

const DEFAULT_SETTINGS: AppSettings = {
  apiUrl: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4o-mini',
  customPrompt: '',
}

export default function App() {
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null)
  const [rawText, setRawText] = useState('')
  const [lyrics, setLyrics] = useState<LyricLine[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isFormatting, setIsFormatting] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [mode, setMode] = useState<EditorMode>('tag')
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('lyric-tagger-settings')
    if (saved) {
      const parsed = JSON.parse(saved)
      return { ...DEFAULT_SETTINGS, ...parsed }
    }
    return DEFAULT_SETTINGS
  })

  const audioRef = useRef<HTMLAudioElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('lyric-tagger-settings', JSON.stringify(settings))
  }, [settings])

  // Keyboard handler for spacebar tagging (only in tag mode)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLInputElement
      ) {
        return
      }

      if (e.code === 'Space' && lyrics.length > 0 && audioFile && mode === 'tag') {
        e.preventDefault()

        const time = audioRef.current?.currentTime ?? 0
        setLyrics((prev) => {
          const updated = [...prev]
          if (currentIndex < updated.length) {
            updated[currentIndex] = { ...updated[currentIndex], time }
          }
          return updated
        })

        setCurrentIndex((prev) => {
          const next = prev + 1
          if (next < lyrics.length) return next
          return prev
        })
      }

      if (e.code === 'Backspace' && lyrics.length > 0 && currentIndex > 0 && mode === 'tag') {
        if (e.target instanceof HTMLElement && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault()
          const newIndex = currentIndex - 1
          setLyrics((prev) => {
            const updated = [...prev]
            updated[newIndex] = { ...updated[newIndex], time: null }
            return updated
          })
          setCurrentIndex(newIndex)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lyrics, currentIndex, audioFile, mode])

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time)
  }, [])

  const handleFormat = async () => {
    if (!rawText.trim()) return
    setIsFormatting(true)
    abortRef.current = new AbortController()
    try {
      const formatted = await formatLyrics(rawText, settings, abortRef.current.signal)
      setRawText(formatted)
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User cancelled, do nothing
      } else {
        alert(`格式化失败: ${err.message}`)
      }
    } finally {
      setIsFormatting(false)
      abortRef.current = null
    }
  }

  const handleCancelFormat = () => {
    abortRef.current?.abort()
  }

  const handleApplyFormatted = () => {
    const lines = rawText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)

    setLyrics(
      lines.map((text, i) => ({
        id: i,
        text,
        time: null,
      }))
    )
    setCurrentIndex(0)
  }

  const handleLineTextChange = (index: number, text: string) => {
    setLyrics((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], text }
      return updated
    })
  }

  const handleLineClick = (index: number) => {
    if (mode === 'tag') {
      setCurrentIndex(index)
    }
  }

  const handleExport = async () => {
    const taggedCount = lyrics.filter((l) => l.time !== null).length
    if (taggedCount === 0) {
      alert('还没有任何歌词被打点，请先进行打点操作')
      return
    }

    const lrcContent = generateLrc(
      lyrics,
      audioFile?.name.replace(/\.[^.]+$/, ''),
      ''
    )
    const defaultName = (audioFile?.name || 'lyrics').replace(/\.[^.]+$/, '.lrc')
    await window.electronAPI.saveLrc(lrcContent, defaultName)
  }

  const handleReset = () => {
    if (lyrics.length > 0 && !confirm('确定要重置所有打点吗？')) return
    setLyrics([])
    setRawText('')
    setCurrentIndex(0)
  }

  const taggedCount = lyrics.filter((l) => l.time !== null).length
  const progress = lyrics.length > 0 ? (taggedCount / lyrics.length) * 100 : 0

  return (
    <div className="app">
      <header className="app-header">
        <h1>Lyric Tagger</h1>
        <div className="header-actions">
          <button className="btn btn-sm" onClick={() => setShowSettings(true)}>
            API 设置
          </button>
        </div>
      </header>

      <div className="audio-bar">
        <FileUploader audioFile={audioFile} onFileLoaded={setAudioFile} />
        <AudioPlayer
          audioUrl={audioFile?.url ?? null}
          onTimeUpdate={handleTimeUpdate}
          audioRef={audioRef}
        />
      </div>

      <main className="app-main">
        {lyrics.length > 0 && (
          <div className="left-panel">
            <div className="tagging-info">
              <div className="mode-toggle">
                <button
                  className={`mode-btn ${mode === 'tag' ? 'active' : ''}`}
                  onClick={() => setMode('tag')}
                >
                  打点模式
                </button>
                <button
                  className={`mode-btn ${mode === 'edit' ? 'active' : ''}`}
                  onClick={() => setMode('edit')}
                >
                  编辑模式
                </button>
              </div>

              <div className="progress-section">
                <div className="progress-text">
                  打点进度: {taggedCount} / {lyrics.length}
                </div>
                <div className="progress-bar-small">
                  <div
                    className="progress-fill-small"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="current-line-info">
                当前: {currentIndex + 1} / {lyrics.length} -{' '}
                {lyrics[currentIndex]?.text || ''}
              </div>

              {mode === 'tag' ? (
                <div className="tagging-hint">
                  <kbd>Space</kbd> 打点 &nbsp;
                  <kbd>Backspace</kbd> 回退 &nbsp;
                  点击歌词行选择打点位置
                </div>
              ) : (
                <div className="tagging-hint">
                  点击歌词行可直接编辑文本内容
                </div>
              )}

              <div className="action-buttons">
                <button className="btn btn-primary" onClick={handleExport}>
                  导出 LRC
                </button>
                <button className="btn" onClick={handleReset}>
                  重置
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={lyrics.length > 0 ? 'right-panel' : 'right-panel full'}>
          <LyricsEditor
            lyrics={lyrics}
            rawText={rawText}
            onRawTextChange={setRawText}
            currentLineIndex={currentIndex}
            isFormatting={isFormatting}
            onFormat={handleFormat}
            onCancelFormat={handleCancelFormat}
            onApplyFormatted={handleApplyFormatted}
            onLineTextChange={handleLineTextChange}
            onLineClick={handleLineClick}
            mode={mode}
          />
        </div>
      </main>

      {showSettings && (
        <Settings
          settings={settings}
          onSettingsChange={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
