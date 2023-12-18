---
title: docker 常用指令
date: 2023-12-19 00:13:54
tags:
- [backend]
- [docker]
category:
- [docker]
index_img: ../image/banner/docker_index.jpg
banner_img: ../image/banner/docker_banner.png
---
### 版本
```shell
docker version
```
### image清單
```shell
docker image ls
```
### 移除鏡像
```shell
docker image rm [OPTIONS] IMAGE [IMAGE...]
```
### 創建並run
以nginx 為例
```shell
docker container run nginx
```
### 容器清單
```shell
docker container ls
```

### 停止容器
容器的名稱可以不用全部打，可以只打ID 的前幾位數
```shell
docker container stop 25
# container 也可以不打
docker stop 25
```

### 查看狀態
```shell
docker container ps -a
```

### 刪除容器
```shell
docker container rm 1a
```