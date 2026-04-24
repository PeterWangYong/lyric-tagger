import type { AppSettings } from '../types'

export async function formatLyrics(
  lyrics: string,
  settings: AppSettings
): Promise<string> {
  const response = await fetch(`${settings.apiUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model: settings.model,
      messages: [
        {
          role: 'system',
          content: `你是一个歌词格式化助手。你的任务是：
1. 检查并修正歌词中的错别字和语法错误
2. 将歌词格式化为一行一句的格式
3. 去除多余的空行和空格
4. 保留歌词原有的段落结构（用空行分隔段落）
5. 不要添加任何时间戳或标记
6. 不要改变歌词的原意
7. 只输出格式化后的歌词，不要添加任何解释`,
        },
        {
          role: 'user',
          content: `请格式化以下歌词：\n\n${lyrics}`,
        },
      ],
      temperature: 0.3,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`API 调用失败: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return data.choices[0].message.content.trim()
}
