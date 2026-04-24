import type { LyricLine } from '../types'

function formatTime(seconds: number): string {
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${String(min).padStart(2, '0')}:${sec.toFixed(2).padStart(5, '0')}`
}

export function generateLrc(
  lines: LyricLine[],
  title?: string,
  artist?: string
): string {
  const header: string[] = []
  if (title) header.push(`[ti:${title}]`)
  if (artist) header.push(`[ar:${artist}]`)

  const taggedLines = lines
    .filter((line) => line.time !== null)
    .sort((a, b) => a.time! - b.time!)
    .map((line) => `[${formatTime(line.time!)}]${line.text}`)

  return [...header, ...taggedLines].join('\n')
}
