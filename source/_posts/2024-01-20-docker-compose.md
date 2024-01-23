---
title: docker compose 的使用
date: 2024-01-20 23:40:18
tags:
- [backend]
- [docker]
category:
- [docker]
index_img: ../image/banner/docker_index.jpg
banner_img: ../image/banner/docker_banner.png
---

# Docker compose

## 介紹

Docker Compose 是一個用於定義和運行多容器Docker應用程序的工具。使用Compose，您可以通過一個{% label danger @YAML
%}文件來配置應用程序的服務。然後，使用一個單一的命令，創建並啟動所有服務的配置。

## 安裝

### {% note primary %}
mac / windows
{% endnote %}

安装docker desktop時會自動安裝，若不滿意版本

### {% note info %}
linux
{% endnote %}

#### curl 安裝
```shell
$ sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
$ sudo chmod +x /usr/local/bin/docker-compose
$ docker-compose --version
docker-compose version 1.29.2, build 5becea4c
```
#### pip 安裝
```shell
pip install docker-compose
```

最新版本號查詢: [https://github.com/docker/compose/releases](https://github.com/docker/compose/releases)

## 結構
```yaml
version: "3.8"

services: # 容器
  servicename: # 服務名稱，這個名稱也是內部 bridge 網路可以使用的 DNS name
    image: # 鏡像的名稱
    command: # 可選，如果設置，則會覆蓋預設鏡像中的 CMD 命令
    environment: # 可選，相當於 docker run 中的 --env
    volumes: # 可選，相當於 docker run 中的 -v
    networks: # 可選，相當於 docker run 中的 --network
    ports: # 可選，相當於 docker run 中的 -p
  servicename2:

volumes: # 可選，相當於 docker volume create

networks: # 可選，相當於 docker network create

```

## 使用
### 基礎指令
- `-d` 或 `--detach`: 在後台運行容器，不顯示日誌輸出。
- `--build`: 在運行之前重新構建映像。
- `--force-recreate`: 強制重新創建容器，即使已經存在。
- `--no-deps`: 不啟動依賴服務。
- `--scale SERVICE=NUM`: 指定要啟動的服務實例數量。
- `--remove-orphans`: 刪除無關聯的容器。
- `--abort-on-container-exit`: 當容器退出時立即停止所有服務。
- `--timeout TIMEOUT`: 設置超時時間，如果超過指定時間沒有完成，則停止服務

### 水平擴展
可以利用 Docker Compose 的`服務副本（replicas）`特性
{% note danger %}
適用於無狀態或者可在多實例間共享狀態的應用
{% endnote %}

#### 範例
```yaml
version: '3.8'

services:
  web:
    image: my-web-app:latest
    deploy:
      replicas: 3
    ports:
      - "80:80"
    networks:
      - webnet

networks:
  webnet:

```
### 環境變量
環境變量提供docker compose 在啟動時可以快速區分不同環境如(開發，生產等)
#### yaml 定義
```yaml
version: '3.8'
services:
  web:
    image: my-web-app:latest
    environment:
      - DB_HOST=dbserver
      - DB_PORT=5432

```

#### 使用 `.env` 文件
```text
DB_HOST=dbserver
DB_PORT=5432
```
```yaml
version: '3.8'
services:
  web:
    image: my-web-app:latest
    environment:
      - DB_HOST=${DB_HOST}
      - DB_PORT=${DB_PORT}

```
#### 使用外部文件
```yaml
version: '3.8'
services:
  web:
    image: my-web-app:latest
    env_file:
      - web-variables.env

```

#### command 中使用
```shell
DB_HOST=dbserver DB_PORT=5432 docker-compose up
```

{% note danger %}
確保不要在環境變量中設定隱私，如密碼或私鑰，尤其是在將 `docker-compose.yml` 文件和相關配置文件納入版本控制系統時。
如果使用 .env 文件或外部文件，需確保這些文件的安全性。
{% endnote %}