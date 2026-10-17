---
name: leetcode-post
description: 把一題 LeetCode 寫成 Hexo 部落格文章：題目描述、解題思路、標注題解作者（如灵茶山艾府）、可互動的動態圖解，並自動判斷 tag。當使用者貼上 LeetCode 題目／題解並要求「寫成文章」「補圖解」「標注作者」時使用。
---

# LeetCode 題解文章

產出一篇放在 `source/_posts/` 的 Hexo 文章，結構固定：**題目 → 前置知識 → 思路 → 動態圖 → 解法（標注作者）→ 複雜度**。範例見 `source/_posts/2026-10-17-leetcode-2379-minimum-recolors.md`。

## 輸入

使用者通常會貼：題目文字、題解文字（含作者與影片連結）、有時附一個圖解 HTML 檔。缺什麼就從貼文推斷；題解作者與連結沒有給的話，不要編造，省略標注並在回覆中說明。

附的 HTML 若是 Claude 介面產生的（用了 `--text-primary`、`--surface-1` 這類變數），不要整份貼進文章，要改寫成自包含版本（見「動態圖」）。

## 檔名與 front matter

檔名：`source/_posts/YYYY-MM-DD-leetcode-<題號>-<kebab-title>.md`，日期用今天。

```yaml
---
title: LeetCode <題號>. <中文題名>（<演算法>圖解）
date: YYYY-MM-DD HH:MM:SS
tags:
- [LeetCode]
- [algorithm]
- [<依下表判斷>]
- [java]
category:
- [LeetCode]
index_img: ../image/banner/leetcode_index.jpeg
banner_img: ../image/banner/LeetCode_banner.jpeg
---
```

### 自動判斷 tag

固定帶 `LeetCode`、`algorithm`，語言用題解程式碼的語言（預設 `java`）。再依題解關鍵字加上：

| 關鍵字 | tag |
|---|---|
| 滑動窗口／滑動視窗／定長窗口 | `sliding window` |
| 雙指針／快慢指針／左右指針 | `two pointers` |
| 二分／二分查找 | `binary search` |
| 動態規劃／DP／狀態轉移 | `dynamic programming` |
| 回溯／DFS／BFS／遞歸 | `backtracking` / `dfs` / `bfs` / `recursion` |
| 前綴和／差分 | `prefix sum` |
| 堆／優先隊列 | `heap` |
| 單調棧／單調隊列 | `monotonic stack` |
| 哈希表／集合 | `hash table` |
| 鏈表／樹／圖／並查集 | `data structure` + 具體名稱 |
| 位運算／`& 1`／異或 | `bit manipulation` |
| 貪心 | `greedy` |

寫 tag 前先 `grep -rh -A8 '^tags' source/_posts | sort | uniq -c | sort -rn`，已有同義 tag 就沿用現有拼法，不要另開。最後在回覆中列出選了哪些 tag。

## 文章結構

1. `## <題號>. <題名>`
2. `### 題目描述`：題意、範例（程式碼區塊）、限制。簡體轉繁體。
3. 標注引用（見下）。
4. `### 前置知識`：只在有必要時寫，一兩段。
5. `### 思路`：先把問題改寫成更簡單的等價問題，再用編號步驟列演算法。
6. `### 圖解（可互動）`：一句說明用哪個範例，接著放動態圖。
7. `### 解法（<作者>）`：完整程式碼，註解寫在關鍵行。
8. 小技巧／答疑（若題解有）。
9. `### 複雜度分析`：時間、空間。

### 標注題解作者

在「前置知識」前放一段引用，並在解法標題帶上作者名：

```markdown
> 本文題解思路與程式碼整理自 LeetCode 題解作者「灵茶山艾府」，[影片講解](https://www.bilibili.com/video/BV1Kd4y1Z7Fv)。圖解為自行補充。
```

- 作者名保留原樣（灵茶山艾府 用簡體原名，不轉繁體）。
- 題解貼文裡的連結常是 `leetcode.cn/link/?target=<URL 編碼>` 轉址，要解碼還原成原始網址。
- 連結只做還原，沒有實際打開驗證，回覆時要這樣說。

## 動態圖

模板在 `widget-template.html`（同目錄），是自包含的步進式視窗動畫（上一步／下一步／重置，顯示視窗、入／出標記、計數與目前最佳值），深淺色跟 Fluid 主題的 `data-user-color-scheme`。

1. 讀模板，替換佔位符：`{{ID}}`（同一頁多張圖時要不同）、`{{N}}`（字串長度，決定欄數）、`{{LABEL}}`（例如 `blocks = "..."，k = 7`）、`{{S}}`、`{{K}}`。
2. 範例用題目的範例 1（需要有「最佳值變動」的那種），n 最好 ≤ 12，手機才不會擠。
3. 整段用 `{% raw %}` … `{% endraw %}` 包住，否則 Hexo 的 markdown 會破壞裡面的 HTML/JS。
4. 模板的邏輯是**定長視窗 + 計數 + 取最小值**。題目不同時改 `calc()` 與 `draw()`：
   - 取最大值：把 `Math.min` 換成 `Math.max`，標籤同步改。
   - 不定長視窗（左右指針各自移動）：改成顯示 `left`、`right` 兩個標記，每步只移動其中一個。
   - 其他演算法（DP、二分、堆疊等）：保留控制列、格子列、數值卡片、說明區這四塊，只重寫步驟資料。
5. 顏色一律用 `--sw-*` 變數，不要寫死色碼；不要引入外部 CSS／JS。

## 驗證與收尾

- 專案有 `node_modules` 才跑 `npx hexo generate`，確認 `public/` 產出的文章內有 `id="swv-` 且沒有殘留 `{% raw`。沒有的話跳過，並在回覆說明未預覽。
- 用 node 把模板填值後的 `<script>` 抽出來跑一遍（`calc` 對每個 `st` 都不丟錯），確認最後一步的答案等於題目範例輸出。
- 提交到使用者指定的分支。不要自行開 PR。
