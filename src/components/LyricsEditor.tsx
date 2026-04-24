import React from 'react'
import type { LyricLine } from '../types'

interface Props {
  lyrics: LyricLine[]
  rawText: string
  onRawTextChange: (text: string) => void
  currentLineIndex: number
  isFormatting: boolean
  onFormat: () => void
  onApplyFormatted: () => void
}

export default function LyricsEditor({
  lyrics,
  rawText,
  onRawTextChange,
  currentLineIndex,
  isFormatting,
  onFormat,
  onApplyFormatted,
}: Props) {
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
        <div className="lyrics-tagged">
          {lyrics.map((line, index) => (
            <div
              key={line.id}
              className={`lyric-line ${index === currentLineIndex ? 'active' : ''} ${
                line.time !== null ? 'tagged' : 'untagged'
              }`}
            >
              <span className="lyric-time">
                {line.time !== null
                  ? `[${String(Math.floor(line.time / 60)).padStart(2, '0')}:${(line.time % 60)
                      .toFixed(2)
                      .padStart(5, '0')}]`
                  : '[  :  .  ]'}
              </span>
              <span className="lyric-text">{line.text}</span>
            </div>
          ))}
        </div>
      ) : (
        <textarea
          className="lyrics-textarea"
          value={rawText}
          onChange={(e) => onRawTextChange(e.target.value)}
          placeholder="在此粘贴歌词文本..."
          spellCheck={false}
        />
      )}
    </div>
  )
}
