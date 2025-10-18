---
title: GCP 網路負載平衡（Network Load Balancing）
date: 2025-10-18 22:38:08
tags: 
- [GCP]
- [Load Balancing]
- [Network Load Balancer]
categories: 
- [GCP]
index_img: ../image/banner/gcp_load_balance.png
---

## 核心觀念

### 什麼是負載平衡？

負載平衡是一種分散技術，用於將進來的網路流量均勻地分配到多個後端伺服器上。它的主要目的是提高系統的可用性、可靠性和效能。

**負載平衡的核心優勢：**
- **高可用性**：當某台伺服器故障時，流量會自動轉向健康的伺服器
- **流量均衡**：避免單一伺服器過載
- **故障轉移**：健康檢查機制自動偵測和排除故障伺服器
- **無縫擴展**：可輕鬆新增或移除伺服器

### GCP 網路負載平衡的架構

```
客戶端請求
    ↓
[轉發規則 (Forwarding Rule)] ← 監聽公開 IP 和埠口
    ↓
[目標池 (Target Pool)] ← 定義後端伺服器集合
    ↓
[後端伺服器] ← www1, www2, www3
    ↓
[健康檢查 (Health Check)] ← 持續監控伺服器狀態
```

---

## 逐步指令說明與觀念

### 第一步：設定 GCP 專案和地區

```bash
# 列出所有專案
gcloud projects list

# 設定專案 ID
gcloud config set project qwiklabs-gcp-04-65fb5bab2bd6

# 設定計算區域（Region）
gcloud config set compute/region us-central1

# 設定計算區域內的特定可用區（Zone）
gcloud config set compute/zone us-central1-b
```

**觀念解釋：**
- **專案（Project）**：GCP 中的獨立工作區，所有資源都屬於某個專案
- **地區（Region）**：地理位置，如 us-central1（美國中部）
- **可用區（Zone）**：地區內的特定資料中心，如 us-central1-b
- **為什麼重要**：設定預設值後，後續命令無需重複指定這些參數

---

### 第二步：建立後端伺服器實例

```bash
# 建立第一個伺服器實例 www1
gcloud compute instances create www1 \
    --zone=us-central1-b \
    --tags=network-lb-tag \
    --machine-type=e2-small \
    --image-family=debian-11 \
    --image-project=debian-cloud \
    --metadata=startup-script='#!/bin/bash
      apt-get update
      apt-get install apache2 -y
      service apache2 restart
      echo "<h3>Web Server: www1</h3>" | tee /var/www/html/index.html'
```

**指令參數說明：**

| 參數 | 說明 |
|------|------|
| `--zone` | 指定伺服器所在的可用區 |
| `--tags` | 標籤，用於識別和套用防火牆規則 |
| `--machine-type` | 機器類型，e2-small 是低成本的計算實例 |
| `--image-family` | 作業系統映像族系，debian-11 表示 Debian 11 |
| `--image-project` | 映像所屬的專案 |
| `--metadata=startup-script` | 啟動腳本，實例啟動時自動執行 |

**啟動腳本的作用：**
- `apt-get update`：更新套件清單
- `apt-get install apache2 -y`：安裝 Apache2 網頁伺服器
- `service apache2 restart`：重啟 Apache 服務
- 最後一行：在首頁顯示伺服器識別標記

**重複此步驟**建立 www2 和 www3，將伺服器標籤改為對應的名稱。

**觀念理解：**
- 創建多個相同配置的伺服器是負載平衡的基礎
- 啟動腳本自動化了伺服器初始化，確保所有伺服器配置一致
- 標籤用於區分和管理伺服器分組

---

### 第三步：建立防火牆規則

```bash
gcloud compute firewall-rules create www-firewall-network-lb \
    --target-tags network-lb-tag \
    --allow tcp:80
```

**參數說明：**

| 參數 | 說明 |
|------|------|
| `--target-tags` | 套用規則的標籤，符合此標籤的實例會受該規則限制 |
| `--allow tcp:80` | 允許 TCP 埠口 80（HTTP）的進入流量 |

**觀念理解：**
- 防火牆規則是 GCP 的網路安全機制
- `tcp:80` 是 HTTP 協定的標準埠口
- 只有標籤為 `network-lb-tag` 的實例才能接收 80 埠的流量
- 這確保了安全性，只有授權的伺服器可以接收客戶端請求

---

### 第四步：建立靜態外部 IP 位址

```bash
gcloud compute addresses create network-lb-ip-1 \
  --region us-central1
```

**觀念理解：**
- **靜態 IP**：不會改變的公開 IP 位址，客戶端可以可靠地訪問此 IP
- **動態 IP**：會隨著實例重啟而改變，不適合作為服務端點
- 為什麼需要：提供一個穩定的入口點給所有客戶端連接

---

### 第五步：建立健康檢查

```bash
gcloud compute http-health-checks create basic-check
```

**預設配置：**
- **埠口**：80
- **路徑**：/
- **協定**：HTTP

**觀念理解 - 健康檢查的重要性：**

健康檢查是負載平衡的核心機制，定期向後端伺服器發送請求檢查其狀態。

```
每 5 秒檢查一次
    ↓
[GET /] → www1 ✓ (200 OK) → 健康，繼續接收流量
        → www2 ✗ (超時)    → 不健康，流量轉向其他伺服器
        → www3 ✓ (200 OK) → 健康，繼續接收流量
```

**健康檢查的工作流程：**
1. 負載平衡器定期向每台伺服器發送 HTTP GET 請求
2. 如果伺服器回應 200 OK，標記為健康
3. 如果伺服器無回應或回應錯誤，標記為不健康
4. 不健康的伺服器會被暫時移出流量池
5. 當伺服器恢復健康時，自動重新加入

---

### 第六步：建立目標池

```bash
gcloud compute target-pools create www-pool \
  --region us-central1 \
  --http-health-check basic-check
```

**參數說明：**

| 參數 | 說明 |
|------|------|
| `--region` | 目標池所在的地區 |
| `--http-health-check` | 關聯的健康檢查名稱 |

**觀念理解：**
- **目標池（Target Pool）**：是一個邏輯概念，代表一組要進行負載平衡的後端伺服器
- **為什麼需要**：它是轉發規則和實際伺服器之間的橋樑
- 目標池包含伺服器列表和健康檢查政策

---

### 第七步：將實例添加到目標池

```bash
gcloud compute target-pools add-instances www-pool \
    --instances www1,www2,www3
```

**觀念理解：**
- 此命令將三個伺服器實例註冊到目標池
- 目標池現在知道應該將流量分配到這三台伺服器
- 後續可以使用類似命令添加或移除伺服器（用於動態擴展）

---

### 第八步：建立轉發規則

```bash
gcloud compute forwarding-rules create www-rule \
    --region us-central1 \
    --ports 80 \
    --address network-lb-ip-1 \
    --target-pool www-pool
```

**參數說明：**

| 參數 | 說明 |
|------|------|
| `--region` | 轉發規則所在的地區 |
| `--ports` | 監聽的埠口（80 = HTTP） |
| `--address` | 綁定的靜態公開 IP 位址 |
| `--target-pool` | 目標池名稱 |

**觀念理解 - 這是負載平衡的「大腦」：**

轉發規則的職責：
1. 監聽指定的公開 IP 和埠口（34.57.214.60:80）
2. 接收進來的客戶端請求
3. 根據負載平衡演算法決定轉發給哪台伺服器
4. 將請求轉發到目標池中的伺服器

**流量流向：**
```
客戶端 (203.0.113.1:54321) → 轉發規則 (34.57.214.60:80)
    ↓ 負載平衡決策（輪詢演算法）
[www1:80] 或 [www2:80] 或 [www3:80]
```

---

### 第九步：查詢轉發規則詳情

```bash
gcloud compute forwarding-rules describe www-rule --region us-central1
```

**輸出重點字段：**

| 字段 | 說明 |
|------|------|
| `IPAddress` | 轉發規則綁定的公開 IP |
| `IPProtocol` | 使用的協定（TCP） |
| `portRange` | 監聽的埠口範圍 |
| `loadBalancingScheme` | 負載平衡方案（EXTERNAL = 公開） |
| `target` | 指向的目標池 |

---

### 第十步：提取 IP 地址並測試

```bash
# 使用 JSON 格式提取 IP 地址
IPADDRESS=$(gcloud compute forwarding-rules describe www-rule \
    --region us-central1 --format="json" | jq -r .IPAddress)

# 顯示 IP 地址
echo $IPADDRESS

# 持續測試負載平衡
while true; do curl -m1 $IPADDRESS; done
```

**指令說明：**

| 部分 | 說明 |
|------|------|
| `--format="json"` | 以 JSON 格式輸出結果，便於程式化解析 |
| `jq -r .IPAddress` | 使用 jq 工具提取 JSON 中的 IPAddress 字段 |
| `-m1` | curl 的 1 秒超時設定 |
| `while true; do` | 無限迴圈，持續發送請求 |

**測試結果解釋：**
- 正常情況：應該看到來自 www1、www2、www3 的輪詢迴應
- 超時錯誤：可能表示防火牆規則未正確套用或伺服器未就緒

---

## 負載平衡演算法

GCP 網路負載平衡器使用以下演算法：

### 1. **輪詢（Round Robin）** - 預設演算法
```
請求 1 → www1
請求 2 → www2
請求 3 → www3
請求 4 → www1（循環開始）
```
優點：簡單、公平、適合無狀態應用

### 2. **會話親和性（Session Affinity）** - 可選
同一客戶端的請求總是轉發到同一伺服器，保持會話狀態一致

---

## 故障排除指南

| 問題 | 原因 | 解決方案 |
|------|------|--------|
| Connection timed out | 防火牆規則未應用或標籤不匹配 | 檢查 `--target-tags` 是否正確 |
| 無法連接到 IP | 伺服器未完全啟動 | 等待 1-2 分鐘讓啟動腳本完成 |
| 伺服器不在目標池中 | 實例標籤不匹配 | 使用 `--tags` 確保標籤一致 |
| 健康檢查失敗 | Apache 未啟動或埠口錯誤 | 檢查 `startup-script` 是否正確執行 |

---

## 最佳實踐

1. **使用標籤分組**：便於管理和套用規則
2. **定期監控健康檢查**：確保後端伺服器狀態正常
3. **使用靜態 IP**：提供穩定的服務端點
4. **設定適當的超時**：避免無限等待
5. **記錄和監控**：使用 Cloud Logging 追蹤流量和錯誤
6. **測試故障轉移**：模擬伺服器故障測試系統可靠性

---

## 進階延伸概念

### HTTP(S) 負載平衡 vs 網路負載平衡
- **網路負載平衡（LB）**：第 4 層（傳輸層），更快速，支援 TCP/UDP
- **HTTP(S) 負載平衡**：第 7 層（應用層），支援 URL 路由、主機名稱路由

### 自動擴展（Auto Scaling）
結合負載平衡器與實例組，根據 CPU 使用率自動增加或減少伺服器數量

### 多地區負載平衡
跨多個地區部署負載平衡器，提供全球高可用性