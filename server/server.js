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
  res.send('Welcome to the OpenAI Text Generation and Quiz API');
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
          content: `${character}という${age}歳のキャラクターについて、以下のキーワードを含む物語を小学生が読めるレベルの言葉で面白く生成してください。漢字は絶対に全部フリガナを書いてください（例:漢字（かんじ））。入力した${character}, ${keywords}にフリガナはいりません。タイトルはつけないでください。キーワード: ${keywords}`
        }
      ],
      max_tokens: null,
      temperature: 0.7
    });

    const generatedText = completion.choices[0].message.content;

    const quizCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'あなたはクイズを生成する助手です。' },
        {
          role: 'user',
          content: `次の物語から比較的難しい単語を3つ選び、正しい意味1つと間違った意味2つを選択肢("a)..."のように)を作成してください。選択肢はわかりやすいもの（そのままの意味は禁止）にしてください。選択肢も含め、絶対に漢字は全て後ろにフリガナを書いてください。正解の選択肢のみ "（正解）" と漢字で明記してください。また、キーワードは問題にしないでください。単語と選択肢のみを返してください。物語: ${generatedText}`
        }
      ],
      max_tokens: null,
      temperature: 0.7
    });

    // GPTのクイズ生成レスポンスをログに表示
    console.log('Quiz Response:', quizCompletion.choices[0].message.content);

    const quizText = quizCompletion.choices[0].message.content;
    const quiz = parseQuiz(quizText);

    res.json({ generatedText, quiz });

  } catch (error) {
    console.error('OpenAI APIエラー:', error.response ? error.response.data : error.message);
    res.status(error.response?.status || 500).json({
      message: 'OpenAI APIからのテキスト生成に失敗しました。',
      error: error.response?.data || error.message
    });
  }
});

function parseQuiz(quizText) {
  const questions = quizText.split('\n\n').filter(q => q.trim() !== '');
  return {
    questions: questions.map(q => {
      const [wordLine, ...optionLines] = q.split('\n');

      // クイズの正しいフォーマットが期待通りか確認
      if (!wordLine || optionLines.length < 3) {
        console.error("Error: Invalid quiz format or missing options", { wordLine, optionLines });
        return null; // 無効なクイズはスキップ
      }

      // "単語: " から始まる行を削除し、余分な数字や記号を削除
      const word = wordLine.replace(/^\d+\.\s*/, '').replace('単語: ', '').replace(/[#*]+/g, '').replace(/\s+/g, '').trim();

      // 正解の選択肢をまず抽出してトリミング
      const correctAnswerLine = optionLines.find(o => o.includes('（正解）'));
      const correctAnswer = correctAnswerLine ? correctAnswerLine.replace(/^[abc]\)\s*|\（正解\）/g, '').trim() : 'No correct answer';

      const options = {
        a: optionLines[0]?.replace('（正解）', '').replace(/^a\)\s*/, '').replace(/^-\s[A-C]\)\s*/, '') || 'No option a',
        b: optionLines[1]?.replace('（正解）', '').replace(/^b\)\s*/, '').replace(/^-\s[A-C]\)\s*/, '') || 'No option b',
        c: optionLines[2]?.replace('（正解）', '').replace(/^c\)\s*/, '').replace(/^-\s[A-C]\)\s*/, '') || 'No option c',
      };
      return { word, options, correct_answer: correctAnswer };
    }).filter(q => q !== null)
  };
}
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Backend server for OpenAI running on port ${PORT}`);
  });

// def extract_difficult_words(generated_story):
//     openai_api_key = settings.OPENAI_API_KEY
//     #openai_api_base = 'https://api.openai.com/v1'  # test
//     openai_api_base = 'https://api.openai.iniad.org/api/v1'  # 必要に応じて他の設定も
//     chat = ChatOpenAI(openai_api_key=openai_api_key, openai_api_base=openai_api_base, model_name='gpt-3.5-turbo', temperature=0)
//     prompt = f"次の物語から3つの難しい単語を選んでください。物語: {generated_story}"
//     response = chat.generate([prompt])

//     # レスポンス全体を出力して確認
//     #print(f"Response: {response.generations}")

//     # response.generations の最初の要素にアクセスし、テキストを取得する
//     difficult_words_text = response.generations[0][0].text

//     # 生成された単語をカンマまたは改行で分割し、リストに変換
//     difficult_words = [word.strip() for word in difficult_words_text.split('\n')]

//     # デバッグ出力
//     print(f"難しい単語: {difficult_words}")

//     return difficult_words


// def generate_quiz_from_words(difficult_words):
//     openai_api_key = settings.OPENAI_API_KEY
//     openai_api_base = 'https://api.openai.iniad.org/api/v1'
//     chat = ChatOpenAI(openai_api_key=openai_api_key, openai_api_base=openai_api_base, model_name='gpt-3.5-turbo', temperature=0)
//     quiz_questions = []

//     for word in difficult_words:
//         # クイズを生成するプロンプト
//         prompt = (
//     f"次の単語 '{word}' に関して、小学生に理解しやすい言葉で、"
//     f"正しい意味1つと、間違った意味2つを含む3つの選択肢を作成してください。"
//     f"選択肢の中で、'{word}' という単語自体と「正しい」や「間違った」という表現を含めないでください。"
//     "また、選択肢には問題の単語やその活用形（たとえば「叶える」の場合、「かなえる」「叶えない」など）を使わないでください。"
//     "選択肢はそれぞれ異なる意味を持ち、わかりやすい言葉で説明してください。"
//     "例として、「叶える」は「自分や誰かがしたいことや、ほしいものが本当にそうなること」のように説明してください。" 
//         )
//         response = chat.generate([prompt])

//         # クイズの選択肢と正解を抽出する
//         quiz_text = response.generations[0][0].text.split("\n")

//         # 空の行や不要な行を除去
//         quiz_text = [line.strip() for line in quiz_text if line.strip()]

//         # 選択肢を取得（正しい意味・間違った意味を含む）
//         correct_answer = quiz_text[0] if quiz_text else None
//         other_options = quiz_text[1:3] if len(quiz_text) > 2 else []  # 2つの不正解の選択肢を取得

//         # 全ての選択肢をまとめ、シャッフル
//         all_options = [correct_answer] + other_options
//         random.shuffle(all_options)


//         # 選択肢にラベル 'a', 'b', 'c' を追加
//         option_labels = ['a', 'b', 'c']
//         labeled_options = {label: option for label, option in zip(option_labels, all_options)}

//         quiz_questions.append({
//             'word': word,
//             'options': labeled_options,  # 'a', 'b', 'c' を付けた選択肢
//             'correct_answer': correct_answer  # 正解の選択肢を保持
//         })

//     return {"questions": quiz_questions}



// def check_answer(user_answer, correct_answer):
//     if user_answer == correct_answer:
//         return True  # 正解
//     else:
//         return False  # 不正解


// def generate_quiz_view(request):
//     if 'create_story' not in request.session:
//         return JsonResponse({"error": "Story not found in session."}, status=400)

//     story = request.session['create_story']
//     # 難しい単語を抽出
//     difficult_words = extract_difficult_words(story)

//     # クイズを生成
//     quiz = generate_quiz_from_words(difficult_words)
//     #print("Generated Quiz:", quiz)  # デバッグ用

//     # クイズをセッションに保存
//     request.session['quiz'] = quiz

//     # クイズを辞書形式で返す
//     return JsonResponse({"quiz": quiz}, safe=False)


// def process_quiz_flow(generated_story, user_answer, question_id):
//     # 1. 難しい単語の抽出
//     difficult_words = extract_difficult_words(generated_story)

//     # 2. クイズの生成
//     quiz = generate_quiz_from_words(difficult_words)

//     # 3. 正誤判定
//     correct_answer = quiz['questions'][question_id]['correct_answer']
//     is_correct = check_answer(user_answer, correct_answer)

//     # 4. 解説と例文の生成
//     correct_word = quiz['questions'][question_id]['word']  # 問題になっている単語を取得
//     explanation = generate_explanation(correct_word,correct_answer)

//     # 5. クイズの結果を返す
//     return {
//         'is_correct': is_correct,
//         'explanation': explanation
//     }

// def validate_quiz(request):
//     if request.method == 'POST':
//         answer = request.POST.get('answer')
//         question_id = int(request.POST.get('question_id'))
//         quiz = request.session.get('quiz', None)

//         if not quiz:
//             return JsonResponse({"error": "Quiz not found in session."}, status=400)

//         # 正しい答えの取得
//         correct_answer = quiz['questions'][question_id]['correct_answer']
//         correct_word = quiz['questions'][question_id]['word']

//         # 解答と正解を比較
//         is_correct = answer == correct_answer

//         # 正解の場合も不正解の場合も同じように例文を生成
//         explanation = generate_explanation(correct_word,correct_answer)

//         return JsonResponse({
//             'correct': is_correct,
//             'explanation': explanation
//         })
//     else:
//         return JsonResponse({"error": "Invalid request method"}, status=405)

// def generate_explanation(correct_word,correct_answer):
//     """
//     解説を生成する関数。ユーザーが選んだ答えと正解を元に、解説を生成します。
//     - correct_word: 問題になっている単語
//     - user_answer: ユーザーが選んだ答え
//     - correct_answer: 正しい答え
//     """
//     openai_api_key = settings.OPENAI_API_KEY
//     openai_api_base = 'https://api.openai.iniad.org/api/v1'
//     chat = ChatOpenAI(openai_api_key=openai_api_key, openai_api_base=openai_api_base, model_name='gpt-3.5-turbo', temperature=0)

//     print(correct_word,correct_answer)
//     prompt = f"次の単語「{correct_word}」の意味を[{correct_answer}]に基づいて説明し、小学生向けの例文を1つ提供してください。"

//     response = chat.generate([prompt])
//     explanation_text = response.generations[0][0].text.split("\n")

//     return explanation_text
