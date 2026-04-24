export interface LyricLine {
  id: number
  text: string
  time: number | null // seconds, null = not tagged yet
}

export interface AudioFile {
  name: string
  path: string
  url: string // blob URL for playback
}

export interface AppSettings {
  apiUrl: string
  apiKey: string
  model: string
}

declare global {
  interface Window {
    electronAPI: {
      openFile: () => Promise<{
        name: string
        path: string
        buffer: ArrayBuffer
      } | null>
      saveLrc: (content: string, defaultName: string) => Promise<boolean>
    }
  }
}
