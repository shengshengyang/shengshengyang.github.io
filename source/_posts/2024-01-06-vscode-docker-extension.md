---
title: 用vscode 插件跑docker 開發環境
date: 2024-01-06 00:36:56
tags:
- [backend]
- [docker]
category:
- [docker]
index_img: ../image/banner/remote_explorer_index.png
banner_img: ../image/banner/docker_banner.png

---

## Remote explorer

vscode 的插件，包含兩個部分

### 開發環境

#### 選擇workspace

選擇想要的資料夾或檔案
![](../image/docker/remote-explorer.png)

#### 選擇環境鏡像

包含許多常見環境如linux, python, node.js 等
![](../image/docker/remote-explorer-env.png)

#### 環境建立
選好後可以看到正在build 及run docker container
![](../image/docker/remote-explorer-running.png)

#### 環境查看
跑完後就會發現已經搭建好一個docker 環境，就可以在不用安裝各種環境的情況下做開發
![](../image/docker/docker-desktop.png)