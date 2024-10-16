const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDBに接続
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// モデルの定義
const Book = mongoose.model('Book', {
  title: String,
  content: String,
  quiz: Array
});

// APIエンドポイント（本のデータを取得）
app.get('/api/book/:id', (req, res) => {
  Book.findById(req.params.id, (err, book) => {
    if (err) return res.status(500).send(err);
    res.json(book);
  });
});

// APIエンドポイント（本のデータを保存）
app.post('/api/book', (req, res) => {
  const newBook = new Book(req.body);
  newBook.save((err, savedBook) => {
    if (err) return res.status(500).send(err);
    res.json(savedBook);
  });
});

// サーバーの起動
app.listen(3001, () => {
  console.log('Backend server running on port 3001');
});
