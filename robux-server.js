// 📦 必要なパッケージを使う：express, cors, fs（保存用）
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 💱 換算API取得（Frankfurter.app）
app.get("/api/rates", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.frankfurter.app/latest?from=USD&to=JPY,EUR"
    );
    res.json(response.data.rates);
  } catch (error) {
    console.error("為替取得失敗:", error);
    res.status(500).json({ error: "為替取得失敗" });
  }
});

// 📝 換算ログ保存
app.post("/api/log", (req, res) => {
  const log = req.body; // { robux, currency, amount, result, timestamp }
  if (!log.robux || !log.currency || !log.result) {
    return res.status(400).json({ error: "ログデータが不正です" });
  }

  const logLine = JSON.stringify(log) + "\n";
  fs.appendFile("conversion_log.jsonl", logLine, (err) => {
    if (err) {
      console.error("ログ保存失敗:", err);
      return res.status(500).json({ error: "保存に失敗しました" });
    }
    res.json({ message: "ログ保存完了" });
  });
});

// 🚀 サーバー起動
app.listen(PORT, () => {
  console.log(`Robux換算サーバー起動中！ポート: ${PORT}`);
});
