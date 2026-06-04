# CofitPlus 健康飲食紀錄 🥗

> 沈浸式健康生態 App — 飲食紀錄 ✕ 瀑布流探索 ✕ 外送整合 ✕ 營養助理

**GitHub：** https://github.com/NightZhe/CofitPlus

---

## 專案簡介

CofitPlus 是一個健康飲食追蹤 App，結合社群瀑布流、沈浸式全螢幕瀏覽、本地食物資料庫與規則式營養助理，幫助用戶輕鬆記錄每日飲食並達成健康目標。

---

## 功能總覽

### 首頁（Dashboard）
- 熱量環狀進度條 + 飲水量顯示
- 小紅書式雙欄瀑布流（用戶餐點、食譜推薦、外送商家）
- 點擊進入**沈浸全螢幕模式**，支援垂直滑動切換

### 記錄餐點（Log Food）
- 本地食物資料庫（30 種常見台灣食物）快速搜尋
- 顯示熱量、蛋白質、碳水、脂肪
- 可拍照留存，選擇餐次（早/午/晚餐、點心）
- 記錄後自動顯示營養點評

### 營養助理（Coach）
- 根據當日飲食紀錄自動分析熱量與蛋白質達標狀況
- 快速問題捷徑（減脂/增肌/高蛋白食物/飲水量）
- 支援自由輸入問題，關鍵字觸發個人化建議
- 無需 API key，完全離線運作

### 健康外送（Eat）
- 健康餐廳列表（卡路里標示、評分、預計到達時間）
- 下單後自動將餐點熱量寫入今日紀錄

### 社群（Social）
- 社群貼文牆（用戶分享飲食成果）
- 週排行榜與挑戰活動

---

## 技術架構

| 技術 | 用途 |
|------|------|
| React 19 + TypeScript | 前端框架 |
| Vite | 打包工具 |
| Tailwind CSS (CDN) | 樣式 |
| lucide-react | 圖示 |
| 本地食物資料庫 | 取代 AI 分析，零依賴離線運作 |

---

## 本地開發

```bash
# Clone 專案
git clone https://github.com/NightZhe/CofitPlus.git
cd CofitPlus

# 安裝依賴
npm install

# 啟動開發伺服器（http://localhost:5173）
npm run dev

# 打包
npm run build
```

無需設定任何 API Key，直接啟動即可使用。

---

## 部署（Railway）

Railway 已設定自動部署，推送到 `main` 分支即觸發：

1. Build：`npm run build`
2. Start：`npx serve -s dist -l $PORT`

設定檔：`railway.json`

---

## 專案結構

```
src/
├── App.tsx               # 主框架、底部導航、狀態管理
├── types.ts              # Meal、DailyQuest、AppTab 型別定義
├── index.tsx             # React 入口
└── components/
    ├── Dashboard.tsx     # 首頁瀑布流 + 沈浸模式
    ├── LogFood.tsx       # 飲食記錄（本地食物資料庫）
    ├── AICoach.tsx       # 規則式營養助理
    ├── FoodDelivery.tsx  # 健康外送
    └── Community.tsx     # 社群動態
```
