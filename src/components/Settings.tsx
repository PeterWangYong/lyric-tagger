import React from 'react'
import type { AppSettings } from '../types'

interface Props {
  settings: AppSettings
  onSettingsChange: (settings: AppSettings) => void
  onClose: () => void
}

export default function Settings({ settings, onSettingsChange, onClose }: Props) {
  const handleChange = (field: keyof AppSettings, value: string) => {
    onSettingsChange({ ...settings, [field]: value })
  }

  return (
    <div className="settings-overlay">
      <div className="settings-panel">
        <div className="settings-header">
          <h3>API 设置</h3>
          <button className="btn btn-sm" onClick={onClose}>
            关闭
          </button>
        </div>
        <div className="settings-body">
          <div className="form-group">
            <label>API 地址</label>
            <input
              type="text"
              value={settings.apiUrl}
              onChange={(e) => handleChange('apiUrl', e.target.value)}
              placeholder="https://api.example.com/v1"
            />
            <small>OpenAI 兼容格式的 API 地址</small>
          </div>
          <div className="form-group">
            <label>API Key</label>
            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) => handleChange('apiKey', e.target.value)}
              placeholder="sk-..."
            />
          </div>
          <div className="form-group">
            <label>模型名称</label>
            <input
              type="text"
              value={settings.model}
              onChange={(e) => handleChange('model', e.target.value)}
              placeholder="MIMO-V2.5-Pro"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
