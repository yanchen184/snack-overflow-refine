# SnackOverFlow Frontend

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.0.0-61DAFB.svg?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.2-3178C6.svg?logo=typescript)
![Refine](https://img.shields.io/badge/Refine-4.47.1-00897B.svg)

SnackOverFlow 是一個使用 React、TypeScript 和 Refine 框架構建的現代化前端應用程序，用於餐飲產品管理系統。

## 🚀 在線演示

訪問應用程序：[https://yanchen184.github.io/snack-overflow-refine/](https://yanchen184.github.io/snack-overflow-refine/)

## ✨ 特點

- 🔐 JWT 認證和基於角色的授權
- 📱 響應式設計，支持所有設備
- 🎨 支持明亮和暗黑模式
- 📊 動態產品和預約管理
- 🔍 強大的搜索和篩選功能
- 📋 詳細的數據視圖和編輯功能
- 🚀 與後端 API 無縫集成

## 🔧 技術棧

- **框架**: [React](https://reactjs.org/)
- **管理框架**: [Refine](https://refine.dev/)
- **語言**: [TypeScript](https://www.typescriptlang.org/)
- **UI庫**: [Chakra UI](https://chakra-ui.com/)
- **路由**: [React Router](https://reactrouter.com/)
- **表單管理**: [React Hook Form](https://react-hook-form.com/)
- **HTTP客戶端**: [Axios](https://axios-http.com/)
- **日期處理**: [dayjs](https://day.js.org/)

## 📦 安裝

1. 克隆倉庫:
```bash
git clone https://github.com/yanchen184/snack-overflow-refine.git
cd snack-overflow-refine
```

2. 安裝依賴:
```bash
npm install
```

3. 啟動開發服務器:
```bash
npm run dev
```

4. 打開 http://localhost:5173

## 🔥 構建與部署

1. 構建生產版本:
```bash
npm run build
```

2. 預覽構建:
```bash
npm run preview
```

## 📁 項目結構

```
src/
├── authProvider/       # 認證提供程序
├── components/         # 共享組件
│   ├── header/         # 頁眉組件
│   ├── layout/         # 布局組件
│   └── sidebar/        # 側邊欄組件
├── dataProvider/       # 數據提供程序
├── interfaces/         # TypeScript 接口
├── pages/              # 頁面組件
│   ├── auth/           # 登入和註冊頁面
│   ├── bookings/       # 預約相關頁面
│   ├── dashboard/      # 儀表板頁面
│   ├── product-classes/# 產品類別頁面
│   └── products/       # 產品相關頁面
├── App.css             # 全局樣式
├── App.tsx             # 主應用組件
└── index.tsx           # 入口點
```

## 🔒 認證和授權

應用程序使用 JWT 令牌進行認證，並支持基於角色的授權，具有以下角色:

- **管理員 (ADMIN)**: 擁有所有功能的完全訪問權限
- **經理 (MANAGER)**: 擁有除用戶管理外的大部分功能訪問權限
- **用戶 (USER)**: 有限的只讀訪問權限

## 🔄 與後端整合

前端應用程序與位於 `http://localhost:8080/api` 的 RESTful API 整合。確保後端服務器正在運行，以便應用程序正常工作。

## 🤝 貢獻

歡迎貢獻! 請隨時提交問題或拉取請求。

## 📄 許可

本項目使用 MIT 許可證 - 詳情請參閱 [LICENSE](LICENSE) 文件。

## 👤 作者

- Yanchen - [GitHub](https://github.com/yanchen184)
