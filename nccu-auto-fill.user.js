// ==UserScript==
// @name         NCCU 教學 & 核心能力問卷自動填答
// @namespace    http://tampermonkey.net/
// @version      1.5.0
// @description  自動填答 NCCU 教學意見調查 & 學生自評核心能力問卷，新增多選題邏輯與防漏填掃描機制
// @match        https://moltke.nccu.edu.tw/stucmt_SSO/app.jsp*
// @match        https://*.nccu.edu.tw/cmmaptqstu/*Default.aspx*
// @match        https://webapp1.nccu.edu.tw/SSO2/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = location.href;

    // ───── 1. 教學意見調查 (處理 iframe 內之表單) ─────
    if (currentUrl.includes('stucmt_SSO/app.jsp')) {

        const surveyTimer = setInterval(() => {
            if (document.querySelector("input[name='S08']") && !window.__surveyDone) {
                clearInterval(surveyTimer);
                window.__surveyDone = true;

                // 點擊函式 (加上防重複點擊判斷)
                const clickQ = (q, v) => {
                    const el = document.querySelector(`input[name='${q}'][value='${v}']`);
                    if (el && !el.checked) el.click();
                };

                // 多選題點擊函式
                const checkMultiple = (q, vArray) => {
                    vArray.forEach(v => clickQ(q, v));
                };

                // 【同意條款】
                document.querySelector("input[name='agree']")?.click();

                // 【多選題區】(依照你的客製化需求)
                // 第一個多選 (M31) 勾前兩個
                checkMultiple("M31", ["1", "2"]);
                // 第二個多選 (M32) 勾七和八
                checkMultiple("M32", ["7", "8"]);
                // 第三個多選 (M59) 勾第二個
                checkMultiple("M59", ["2"]);

                // 【學習狀況】
                clickQ("S08", "1");
                clickQ("S09", "4");
                clickQ("S10", "4");

                // 【教學成效共同題】(隨機 1~3 分)
                const common = ["S13","S14","S15","S18","S19","S20","S21","S22","S24","S25","S26","S27","S28"];
                common.forEach(q => {
                    const r = Math.random(), v = r < 0.5 ? "1" : r < 0.8 ? "2" : "3";
                    clickQ(q, v);
                });
                clickQ("S23", "2"); // 特殊共同題固定值

                // 【英語授課/客製題】
                const cust = { S35:"1", S36:"1", S37:"1", S38:"1", S39:"1", S40:"1", S41:"5" };
                Object.entries(cust).forEach(([q, v]) => clickQ(q, v));

                // 【關鍵能力題】(隨機 3~5 分)
                const keyQs = ["S45","S46","S47","S48","S49","S50","S51"];
                keyQs.forEach(q => {
                    const r = Math.random(), v = r < 0.5 ? "5" : r < 0.8 ? "4" : "3";
                    clickQ(q, v);
                });

                // 【彈性授課題/新題組】
                const flexFirst = ["S54", "S55", "S56", "S58", "S60"];
                flexFirst.forEach(q => clickQ(q, "1"));

                const flexNoOpinion = ["S57"];
                flexNoOpinion.forEach(q => clickQ(q, "4"));

                // 🌟 【終極防漏填掃描機制】 🌟
                // 找出畫面上所有的單選題代號
                const allRadioNames = new Set([...document.querySelectorAll('input[type="radio"]')].map(el => el.name));
                allRadioNames.forEach(q => {
                    // 檢查該題有沒有被勾選
                    const isAnswered = document.querySelector(`input[name='${q}']:checked`);
                    if (!isAnswered) {
                        // 如果漏填，直接抓該題的第一個選項來點擊保底
                        const firstOption = document.querySelector(`input[name='${q}']`);
                        if (firstOption) {
                            firstOption.click();
                            console.log(`[防漏填觸發] 自動補上未知題目: ${q}`);
                        }
                    }
                });

                console.log("教學意見調查自動填答完成！");
            }
        }, 200);
    }

    // ───── 2. 學生自評核心能力問卷 ─────
    if (currentUrl.toLowerCase().includes('default.aspx')) {

        const coreTimer = setInterval(() => {
            const dropdowns = document.querySelectorAll("select[id$='ddlLevNum']");
            if (dropdowns.length > 0 && !window.__coreDone) {
                clearInterval(coreTimer);
                window.__coreDone = true;

                dropdowns.forEach(sel => {
                    sel.value = "5";
                    sel.dispatchEvent(new Event('change'));
                });
                console.log("核心能力問卷自動填答完成！");
            }
        }, 200);
    }
})();
