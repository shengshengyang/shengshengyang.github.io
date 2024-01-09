---
title: 輸入網址後的流程
date: 2024-01-07 23:57:57
tags:
- [http]
- [internet]
index_img: ../image/banner/http_index.png
banner_img: ../image/banner/internet_banner.jpeg
---
# 瀏覽器中輸入URL後的過程

### mermaid 圖
{% mermaid %}
graph LR
A[輸入URL] --> B[解析URL]
B --> C[檢查本地DNS緩存]
C -->|未找到| D[DNS查詢]
C -->|已找到| E[使用緩存的IP]
D --> E
E --> F{是HTTPS嗎?}
F -- 是 --> G[進行SSL/TLS交握]
F -- 否 --> H[建立TCP連接]
G --> I[建立TCP連接]
H --> J[發送HTTP請求]
I --> J
J --> K[伺服器處理請求]
K --> L[伺服器發送HTTP響應]
L --> M[瀏覽器渲染頁面]
M --> N[關閉連接]


{% endmermaid %}

### **1. 解析URL**
- 瀏覽器解析您輸入的URL，確定要訪問的協議（如HTTP或HTTPS）、服務器（域名）和路徑（網頁的具體地址）。

### **2. DNS查詢**
- 瀏覽器檢查本地緩存是否有該域名的IP地址。
- 如果沒有，則向配置的DNS伺服器發送DNS查詢。

### **3. 建立連接（對於HTTPS）**
- 如果是HTTPS，瀏覽器會先與服務器進行一系列握手操作，以建立SSL/TLS安全連接。

### **4. 發送HTTP請求**
- 瀏覽器向服務器的IP地址發送HTTP請求。

### **5. 服務器處理請求**
- 服務器接收到TCP封包，提取HTTP請求，然後處理該請求。

### **6. 服務器響應**
- 服務器發送HTTP響應，包含所請求網頁的內容。

### **7. 瀏覽器渲染網頁**
- 瀏覽器接收到HTTP響應後，開始解析HTML、CSS和JavaScript內容，並渲染網頁。

### **8. 關閉連接**
- 一旦網頁加載完畢，根據HTTP協議的版本，TCP連接可能會保持開放或被關閉。

