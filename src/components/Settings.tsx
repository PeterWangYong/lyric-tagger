import React, { useState } from 'react'
import type { AppSettings } from '../types'

interface Props {
  settings: AppSettings
  onSettingsChange: (settings: AppSettings) => void
  onClose: () => void
}

export default function Settings({ settings, onSettingsChange, onClose }: Props) {
  const [local, setLocal] = useState({ ...settings })
  const [saved, setSaved] = useState(false)

  const handleChange = (field: keyof AppSettings, value: string) => {
    setLocal((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    onSettingsChange({ ...local })
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
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
              value={local.apiUrl}
              onChange={(e) => handleChange('apiUrl', e.target.value)}
              placeholder="https://api.example.com/v1"
            />
            <small>OpenAI 兼容格式的 API 地址</small>
          </div>
          <div className="form-group">
            <label>API Key</label>
            <input
              type="password"
              value={local.apiKey}
              onChange={(e) => handleChange('apiKey', e.target.value)}
              placeholder="sk-..."
            />
          </div>
          <div className="form-group">
            <label>模型名称</label>
            <input
              type="text"
              value={local.model}
              onChange={(e) => handleChange('model', e.target.value)}
              placeholder="MIMO-V2.5-Pro"
            />
          </div>
          <div className="form-group">
            <label>自定义格式化需求</label>
            <textarea
              className="form-textarea"
              value={local.customPrompt}
              onChange={(e) => handleChange('customPrompt', e.target.value)}
              placeholder={`留空使用默认需求：\n- 检查错别字和语法错误\n- 格式化为一行一句\n- 去除多余空行和空格\n- 保留段落结构\n- 不添加时间戳\n- 不改变歌词原意`}
              rows={5}
            />
            <small>自定义 AI 格式化歌词时的提示词，留空使用默认</small>
          </div>
          <div className="settings-footer">
            <button className="btn btn-primary" onClick={handleSave}>
              {saved ? '已保存' : '保存设置'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
