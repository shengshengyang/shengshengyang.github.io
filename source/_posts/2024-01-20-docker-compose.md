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
```shell
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
- `-d` 或 `--detach`: 在後台運行容器，不顯示日誌輸出。
- `--build`: 在運行之前重新構建映像。
- `--force-recreate`: 強制重新創建容器，即使已經存在。
- `--no-deps`: 不啟動依賴服務。
- `--scale SERVICE=NUM`: 指定要啟動的服務實例數量。
- `--remove-orphans`: 刪除無關聯的容器。
- `--abort-on-container-exit`: 當容器退出時立即停止所有服務。
- `--timeout TIMEOUT`: 設置超時時間，如果超過指定時間沒有完成，則停止服務