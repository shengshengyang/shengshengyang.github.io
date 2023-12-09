---
title: gcp sql 實際連線
date: 2023-12-09 12:43:00
tags:
- [GCP]
- [backend]
- [cloud]
- [sql]
category:
- [GCP]
index_img: ../image/banner/GCP_index.png
banner_img: ../image/banner/GCP_banner.jpg
---
### 創建instance
側邊欄點擊`sql` 後 `create instance`
### 連結sql (cloud shell)
```shell
gcloud sql connect myinstance --user=root
```