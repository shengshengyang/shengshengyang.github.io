---
title: linux常用指令
date: 2023-12-05 11:07:52
tags:
- [linux]
- [backend]
category:
- [linux]
index_img: ../image/banner/linux.jpg
banner_img: ../image/banner/linux1.webp
---
## 記錄一些工作中常用的指令
### 展開紀錄並查詢
``` shell
cat <filename> | grep '<condition>'
```
### 抓取指定行數
```shell
# To display the first 10 lines of a file
head -n 10 <filename>

# To display the last 10 lines of a file
tail -n 10 <filename>
```
### 使用 zcat 展開並查詢 gzip 壓縮檔案
```shell
zcat <filename.gz> | grep '<condition>'
```
### 查找特定檔案特定條件的前後10行
```shell
grep '<condition>' -C 10 '<filemane>'
```
### 使用 awk 搜尋特定條件
```shell
awk '/<condition>/' <filename>
```
### 使用 sed 搜尋特定條件
```shell
sed -n '/<condition>/p' <filename>
```
### 查看特定網路介面的 IP 地址
```shell
ifconfig
# 或者
ip addr show
```
### 查看路由表
```shell
route -n
# 或者
ip route
```
### 查看port 號占用後終止
```shell
lsof -i :<port-number>
kill -9 <PID>
```
