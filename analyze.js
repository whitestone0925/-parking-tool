export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image, mimeType } = req.body;
  if (!image) return res.status(400).json({ error: 'No image provided' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mimeType || 'image/jpeg', data: image }
            },
            {
              type: 'text',
              text: `あなたはコインパーキング設計の専門家です。この土地の図面から寸法を読み取ってください。

以下の情報を抽出してください：
- 間口（幅）: メートル単位
- 奥行（長さ）: メートル単位  
- 面積: 平方メートル単位（記載がある場合）
- 備考: 道路付け・形状の特徴など

必ずJSONのみで返答してください（前置き・後置き・コードブロック不要）。
形式: {"width": 数値またはnull, "depth": 数値またはnull, "area": 数値またはnull, "note": "備考文字列"}`
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const raw = (data.content || []).map(c => c.text || '').join('').trim();
    const clean = raw.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
