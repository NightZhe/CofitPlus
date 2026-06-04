# Car+ 二手精品車 🚗

> 沈浸式二手車銷售平台 — 用戶端全螢幕瀏覽 ✕ 商家端即時管理

**線上網址：** https://cofitplus-production.up.railway.app/

---

## 專案簡介

Car+ 是一個雙端二手車銷售 App，分為**用戶端**與**商家端**，透過 URL 路由完全分離，共用同一套車輛資料庫，商家上架車輛後即時反映到用戶端。

| 路徑 | 功能 |
|------|------|
| `/` | 用戶端 — 沈浸式瀏覽車輛 |
| `/merchant` | 商家端 — 密碼登入後管理車輛 |

---

## 用戶端功能

- **沈浸式全螢幕瀏覽** — 垂直 Snap Scroll，每輛車佔滿整個畫面
- **多圖輪播** — 左右滑動切換車輛照片，圓點指示目前頁數
- **車輛詳情** — 規格表（年份、里程、燃料、變速、顏色、車況）、配備標籤、說明、電話詢問
- **搜尋 + 篩選** — 關鍵字搜尋，支援燃料類型 / 變速箱 / 車況 / 價格範圍篩選
- **收藏清單** — 點擊 ♥ 收藏，以 localStorage 持久化

## 商家端功能

- **密碼登入保護**（示範密碼：`dealer168`）
- **儀表板總覽** — 車輛數、可售數、已售數、瀏覽次數、平均售價
- **車輛管理** — 新增、編輯、標記售出/重新上架、刪除（二次確認）
- **上架表單** — 完整欄位填寫，支援最多 5 張圖片 URL、自訂配備標籤
- **即時同步** — 商家異動立即反映到用戶端

---

## 技術架構

| 技術 | 用途 |
|------|------|
| React 19 + TypeScript | 前端框架 |
| React Router v7 | `/` 用戶端 ↔ `/merchant` 商家端路由 |
| Vite | 打包工具 |
| Tailwind CSS (CDN) | 樣式 |
| lucide-react | 圖示 |
| localStorage | 車輛資料 & 收藏持久化 |
| Railway | 部署平台 |

---

## 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器（http://localhost:3000）
npm run dev

# 打包
npm run build
```

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
├── App.tsx                          # 路由根節點、車輛狀態管理
├── types.ts                         # Car、FilterState 型別定義
└── components/
    ├── customer/
    │   ├── CustomerApp.tsx          # 用戶端主框架 + 底部導航
    │   ├── CarGallery.tsx           # 全螢幕 Snap Scroll 車輛列表
    │   ├── CarDetail.tsx            # 車輛詳情 Overlay
    │   └── SearchFilter.tsx         # 搜尋與篩選
    └── merchant/
        ├── MerchantLogin.tsx        # 商家登入
        ├── MerchantApp.tsx          # 商家端主框架 + 底部導航
        ├── MerchantDashboard.tsx    # 統計儀表板
        ├── MerchantListings.tsx     # 車輛列表管理
        └── CarForm.tsx              # 新增 / 編輯車輛表單
```
