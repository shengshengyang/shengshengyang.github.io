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
# 交互模式 / run 之後開啟shell
docker container run nginx -it
# 後臺模式
docker container run -d nginx
# 指定port
docker container run -p 80:80 nginx
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
# 停止全部容器
docker container stop $(docker container ps -aq)
```

### 查看狀態
```shell
docker container ps -a
```

### 刪除容器
```shell
docker container rm 1a
# 刪除全部容器
docker container rm $(docker container ps -aq)
```

### 看log
```shell
docker container logs <ID>
# 檢視實時log
docker containter logs -f <ID>
```