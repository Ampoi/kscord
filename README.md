# KScord

学年ライン用のDiscordBotです。

# Requirement

* NodeJS v16.6.0 or higher

# Installation

```bash
npm install

mkdir database
touch database/kadai.db

touch .env
```

```bash
＃ edit .ENV
TOKEN="" # discord bot token
CLIENT="" # client id
GUILD="" # guild id (サーバー設定から確認)
GOO_APIKEY="" # (ひらがなAPIを使用する際に必要)
```

# Usage

```bash
git clone https://github.com/skuronosuke/kscord.git
cd kscord
npm run start # 開発用
npm run serve # Mac・Linuxを使用しているならばサーバー用
```

# Author

Ampoi
