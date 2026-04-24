# Lyric Tagger

一款 macOS 桌面应用，用于 MP3 音乐的歌词打点（LRC 时间戳标注）。

## 功能

- **音频播放** — 支持 MP3、WAV、OGG、FLAC、M4A 格式
- **歌词编辑** — 粘贴歌词文本，支持手动编辑
- **AI 格式化** — 调用大模型（MIMO-V2.5-Pro 等 OpenAI 兼容 API）自动检查错别字、语法错误，格式化歌词为一行一句
- **键盘打点** — 播放音乐时按 `Space` 键对当前歌词行打点，自动跳转下一行
- **回退修改** — 按 `Backspace` 回退到上一行并清除时间戳
- **导出 LRC** — 生成标准 LRC 格式文件，支持自定义保存路径

## 安装

```bash
git clone https://github.com/PeterWangYong/lyric-tagger.git
cd lyric-tagger
npm install
```

## 运行

```bash
npm run dev
```

## 使用流程

1. 点击 **选择音频文件** 上传音乐
2. 在右侧编辑器粘贴歌词文本
3. （可选）点击 **AI 格式化** 按钮，让大模型检查并格式化歌词
4. 点击 **应用歌词** 将文本转为可打点的歌词行
5. 播放音乐，在每句歌词开始时按 `Space` 打点
6. 打点完成后点击 **导出 LRC** 保存文件

## API 配置

点击右上角 **API 设置**，填入：

| 字段 | 说明 |
|------|------|
| API 地址 | OpenAI 兼容格式的 base URL（如 `https://api.example.com/v1`） |
| API Key | 你的 API 密钥 |
| 模型名称 | 如 `MIMO-V2.5-Pro`、`gpt-4o-mini` 等 |

## LRC 输出格式

```
[ti:歌曲名]
[00:12.34]第一行歌词
[00:18.56]第二行歌词
[00:25.78]第三行歌词
```

## 技术栈

- Electron + React 19 + TypeScript
- Vite 构建
- OpenAI 兼容 API

## 快捷键

| 按键 | 功能 |
|------|------|
| `Space` | 对当前歌词行打点 |
| `Backspace` | 回退并清除上一行时间戳 |

## License

MIT
