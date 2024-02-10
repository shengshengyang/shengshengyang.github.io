---
title: 開源BI - apache superset
date: 2024-02-10 22:06:51
tags:
- [BI]
- [superset]
category:
- [BI]
index_img: ../image/banner/superset_index.jpg
banner_img: ../image/banner/superset_banner.jpg
---
# apache superset
GPT
Apache Superset 是一個開源的數據探索和可視化平台，旨在快速、直觀地對數據進行分析和分享。它由 Airbnb 的數據團隊於 2015 年創建，後來成為 Apache 軟件基金會（ASF）的項目之一。Superset 能夠與各種數據源連接，包括傳統的 SQL 數據庫（如 MySQL 和 PostgreSQL）、大數據處理系統（如 Apache Hive 和 Presto）以及現代的數據倉庫解決方案（如 Snowflake、BigQuery 和 Redshift）。

## 安裝

### docker-compose

#### clone repo
```shell
git clone https://github.com/apache/superset.git
```

#### run

```shell
cd superset
docker compose up
```

#### 更多設定
[https://superset.apache.org/docs/installation/installing-superset-using-docker-compose/](https://superset.apache.org/docs/installation/installing-superset-using-docker-compose/)


## 介面