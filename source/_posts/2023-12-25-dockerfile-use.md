---
title: dockerfile 使用大全
date: 2023-12-25 00:33:24
tags:
- [backend]
- [docker]
category:
- [docker]
index_img: ../image/banner/docker_index.jpg
banner_img: ../image/banner/docker_banner.png
---
# Dockerfile
用來提供docker 建立鏡像的文檔

## 鏡像選擇(From)
### 原則
- 官方 > 開源 > 其他
- 固定版本不用 `:latest`
- 盡量選擇小體積`image`

## 文件複製及目錄

### 一般文件

可以使用 `copy` 或是 `add` 兩者在一般文件的效果是一樣的
```dockerfile
FROM python:3.9.5-alpine3.13
COPY hello.py /app/hello.py
```
```dockerfile
FROM python:3.9.5-alpine3.13
ADD hello.py /app/hello.py
```

### 壓縮檔

{% label primary @add %} 在使用上會比copy好的是add 會自動將 gzip 檔解壓縮後在加入
```dockerfile
FROM python:3.9.5-alpine3.13
ADD hello.tar.gz /app/
```

### 使用原則

一般文件用 `copy` 需要解壓縮用 `add`
