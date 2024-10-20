// server/server.js

const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

app.get('/', (req, res) => {
  res.send('Welcome to the OpenAI Text Generation API');
});

app.post('/api/generate', async (req, res) => {
  const { character, age, keywords, maxTokens } = req.body;

  if (!character || !age || !keywords) {
    return res.status(400).json({
      message: '必須フィールド（キャラクター、年齢、キーワード）が不足しています。',
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'あなたは物語を生成する助手です。' },
        {
          role: 'user',
          content: `${character}という${age}歳のキャラクターについて、以下のキーワードを含む物語を面白く生成してください：${keywords}`
        }
      ],
      max_tokens: maxTokens || null,
      temperature: 0.7
    });

    res.json({ generatedText: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI APIエラー:', error.response ? error.response.data : error.message);
    res.status(error.response?.status || 500).json({
      message: 'OpenAI APIからのテキスト生成に失敗しました。',
      error: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server for OpenAI running on port ${PORT}`);
});
