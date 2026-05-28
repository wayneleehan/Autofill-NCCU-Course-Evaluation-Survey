# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [Unreleased]
- Planned improvements and bugfixes

---

## [1.0.0] – 2025-05-26
### Added
- 初始發佈：  
  - `nccu-auto-fill.user.js` Tampermonkey 腳本  
  - 自動填答 NCCU 教學意見調查（含中/英授課偵測）  
- `README.md`：專案說明、安裝與使用步驟  
- `LICENSE`：MIT 授權條款  
- `.gitignore`：常見系統與編輯器忽略清單  

## [1.5.0] – 2026-05-28
### Added
- 新增多選題型（checkbox）自動填答支援，可自訂特定題目（如 M31, M32, M59）的勾選順序。
- 新增「終極防漏填掃描機制」，填答完畢後自動偵測並保底填寫系統動態產生的未知單選題（預設勾選第一個選項）。
- 支援 2026 年度最新問卷題號結構（新增 S46~S52 等新版延伸題組的填答邏輯）。
- 於 `README.md` 新增「常見問題與除錯 (Troubleshooting)」區塊，記錄 `debugger;` 中斷點與漏填問題解法。

### Changed
- 廢除固定秒數延遲 (`setTimeout`)，全面升級為動態輪詢機制 (`setInterval`)，有效解決 iframe 載入速度不同步導致的 Race Condition 問題。
- 擴充 `@match` 網域觸發規則，正式支援政大校務系統跳轉後的新網域 (`webapp1.nccu.edu.tw/SSO2/*`)。

### Fixed
- 修復 `clickQ` 函式中 Template Literals（反引號）語法遺漏導致腳本發生 ReferenceError 崩潰的問題。
- 修復彈性授課題號陣列分類重疊，導致腳本重複點擊互相覆蓋的問題。
