---
title: AWS CloudWatch 及 Performance Insight 監控sql 品質
date: 2024-11-08 08:55:23
tags:
- [aws]
- [http]
category:
- [aws]
index_img: ../image/banner/aws_index.jpeg
banner_img: ../image/banner/aws_banner.png
---

# AWS CloudWatch

CloudWatch 是 AWS 提供的一種監控和管理服務，專門用於收集並追蹤 AWS 資源及應用程序的運行指標和日誌。它可以監控各種資源，例如 EC2、RDS、S3 以及其他 AWS 服務，並提供一個集中式的平台來分析資源的健康狀態和性能。
## 監控

### 時間選擇

觀看時可以選擇時間(總時長)，及時間期間(多久時間一段)，方便觀看
![cloud_watch_time.png](..%2Fimage%2Faws%2Fcloud_watch_time.png)

### 監控指標

可以選擇監控的指標，例如CPU, Memory, Disk, Network，通常在cpu 及 DBload 這兩塊會很容易看出壅塞塞車的情況

![cloud_watch_metric.png](..%2Fimage%2Faws%2Fcloud_watch_metric.png)

## 警報
可以根據監控指標，設定超出時通知，例如CPU 超過70% 通知

![cloud_watch_alert.png](..%2Fimage%2Faws%2Fcloud_watch_alert.png)

下圖可以看到時間區間內，CPU 使用率超過70% 的情況，可以看到有兩次超過70% 的情況，並且在下面的警示中寬度顯示了持續期間
![cloud_watch_alert_2.png](..%2Fimage%2Faws%2Fcloud_watch_alert_2.png)

# Performance Insights
Performance Insights 是 AWS 為 Amazon RDS 和 Amazon Aurora 數據庫提供的性能監控和優化工具，專門用於深入分析數據庫的性能瓶頸，幫助開發者和資料庫管理員了解和優化 SQL 查詢效率。

### 工作負載視圖

<p class="note note-warning">每個db可免費監控的時長為一周，要往上加要付費</p>
使用{%label danger @「負載」%}的概念來表示數據庫的運行情況，並可視化顯示系統的負載隨時間的變化。

可以選擇
- database: 就是schema
- host: 哪一個主機訪問的最多
- user: 登入的使用者
- sql: 哪一個sql 最多
- wait event: 等待事件，通常比較大的會是i/o

![performance_insight.png](..%2Fimage%2Faws%2Fperformance_insight.png)

### SQL 詳細視圖

可以看到sql 的執行時間，及執行次數，可以看到哪一個sql 最耗時，最常執行

使用時可以先拉出想看的較長時間區間，再透過選取去把峰值得sql 拉出來看，其中灰線是DB 的 核心負載，通常超過時會造成I/O等待時間，這時候就要檢查sql 了
![performance_insight_time.gif](..%2Fimage%2Faws%2Fperformance_insight_time.gif)

接下來只要將下方的sql 點開，就可以看到sql 的詳細資訊，包括執行時間，執行次數，等待時間，等待次數，等待事件等
![performance_insight_sql_list.png](..%2Fimage%2Faws%2Fperformance_insight_sql_list.png)

抓出戰犯後，接下來就是快樂的sql優化時間了
![BIGGER _DATABASE.png](..%2Fimage%2FBIGGER%20_DATABASE.png)