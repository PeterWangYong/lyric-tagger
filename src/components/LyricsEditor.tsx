import React, { useEffect, useRef, useCallback } from 'react'
import type { LyricLine } from '../types'

export type EditorMode = 'edit' | 'tag'

interface Props {
  lyrics: LyricLine[]
  rawText: string
  onRawTextChange: (text: string) => void
  currentLineIndex: number
  isFormatting: boolean
  onFormat: () => void
  onCancelFormat: () => void
  onApplyFormatted: () => void
  onLineTextChange: (index: number, text: string) => void
  onLineClick: (index: number) => void
  mode: EditorMode
}

export default function LyricsEditor({
  lyrics,
  rawText,
  onRawTextChange,
  currentLineIndex,
  isFormatting,
  onFormat,
  onCancelFormat,
  onApplyFormatted,
  onLineTextChange,
  onLineClick,
  mode,
}: Props) {
  const listRef = useRef<HTMLDivElement>(null)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Auto-scroll to current line
  useEffect(() => {
    const el = lineRefs.current[currentLineIndex]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [currentLineIndex])

  const setLineRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      lineRefs.current[index] = el
    },
    []
  )

  const handleLineClick = (index: number) => {
    onLineClick(index)
    if (mode === 'edit') {
      inputRefs.current[index]?.focus()
    }
  }

  return (
    <div className="lyrics-editor">
      <div className="editor-header">
        <h3>歌词</h3>
        <div className="editor-actions">
          <button
            className="btn btn-sm"
            onClick={onFormat}
            disabled={isFormatting || !rawText.trim()}
          >
            {isFormatting ? 'AI 格式化中...' : 'AI 格式化'}
          </button>
          {rawText.trim() && lyrics.length === 0 && (
            <button className="btn btn-sm btn-primary" onClick={onApplyFormatted}>
              应用歌词
            </button>
          )}
        </div>
      </div>

      {lyrics.length > 0 ? (
        <div className="lyrics-tagged-container">
          <div className="lyrics-tagged" ref={listRef}>
            {lyrics.map((line, index) => (
              <div
                key={line.id}
                ref={setLineRef(index)}
                className={`lyric-line ${index === currentLineIndex ? 'active' : ''} ${
                  line.time !== null ? 'tagged' : 'untagged'
                } ${mode === 'tag' ? 'clickable' : ''}`}
                onClick={() => handleLineClick(index)}
              >
                <span className="lyric-time">
                  {line.time !== null
                    ? `[${String(Math.floor(line.time / 60)).padStart(2, '0')}:${(line.time % 60)
                        .toFixed(2)
                        .padStart(5, '0')}]`
                    : '[  :  .  ]'}
                </span>
                <input
                  ref={(el) => { inputRefs.current[index] = el }}
                  className="lyric-text-input"
                  type="text"
                  value={line.text}
                  onChange={(e) => onLineTextChange(index, e.target.value)}
                  readOnly={mode === 'tag'}
                  spellCheck={false}
                />
              </div>
            ))}
          </div>
          {isFormatting && (
            <div className="format-overlay">
              <div className="format-overlay-content">
                <div className="spinner" />
                <span>AI 格式化中...</span>
                <button className="btn btn-sm" onClick={onCancelFormat}>
                  取消
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="lyrics-raw-container">
          <textarea
            className="lyrics-textarea"
            value={rawText}
            onChange={(e) => onRawTextChange(e.target.value)}
            placeholder="在此粘贴歌词文本..."
            spellCheck={false}
          />
          {isFormatting && (
            <div className="format-overlay">
              <div className="format-overlay-content">
                <div className="spinner" />
                <span>AI 格式化中...</span>
                <button className="btn btn-sm" onClick={onCancelFormat}>
                  取消
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
