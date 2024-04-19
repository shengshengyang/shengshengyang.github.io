---
title: 用docker desktop在本地啟動kubernetes
date: 2024-04-19 22:05:12
tags:
index_img: ../image/banner/k8s_index.png
banner_img: ../image/banner/k8s_banner.png
---

得益於`docker desktop`已經有集成kubernetes，在`mac os` 或 `windows`都可以直接使用來建成本地端的k8s做練習

### 啟動設定
勾選啟用後，按下方的`apply & restart`

![](../image/k8s/k8s-docker-desktop-setting.png)

### 啟動狀態
可在側邊欄最下方看到已經啟動的k8s

![](../image/k8s/k8s-already-on.png)

### 啟動後確認
也可以在終端機輸入指令來確認

```shell
kubectl version
```

![](../image/k8s/k8s-cmd.png)