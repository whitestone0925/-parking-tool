# コインパーキング台数算出ツール

図面画像をアップロードするとAIが自動解析し、3パターンの駐車台数を算出します。

## デプロイ手順（Vercel）

### 1. GitHubにアップロード
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/あなたのユーザー名/parking-tool.git
git push -u origin main
```

### 2. Vercelにデプロイ
1. https://vercel.com にアクセスしてGitHubでログイン
2. 「New Project」→ リポジトリを選択
3. 「Deploy」を押すだけ

### 3. 環境変数を設定（重要）
Vercelのプロジェクト設定 → Environment Variables に追加：
```
ANTHROPIC_API_KEY = sk-ant-api03-xxxx（あなたのAPIキー）
```

### 4. 完成
デプロイされたURLで図面をアップロードするだけで全自動解析！

## ファイル構成
```
parking-tool/
├── public/
│   └── index.html      # メインUI
├── api/
│   └── analyze.js      # AI解析APIエンドポイント
├── vercel.json         # Vercel設定
└── package.json
```

## 3パターンの定義
| プラン | ロス率 | 1台あたり面積 |
|--------|--------|--------------|
| ① 最大化 | 10% | 16.5 m² |
| ② 標準   | 15% | 18.0 m² |
| ③ 保守的 | 20% | 19.8 m² |
