---
title: 紀錄目前hexo 常用的指令
date: 2023-12-01 22:22:21
tags:
- [hexo]
categories:
- [frontend, Hexo]
---
### 清除生成檔案
請注意不要再 serve 的狀況下去做清除，不然有些沒有要清掉的資源會一起被刪掉
```shell
hexo c
```
### 生成檔案
生成html 等
```shell
hexo g
```
### 部屬本地
預設4000 port，假設要改成80 port 就用
```shell
hexo s -p 80
```
### 新建文章
默認的layout 為 post, 也可以建立屬於自己的layout
有指定layout 時會去 `scaffolds ` 中找尋同名的 `layout.md `檔，並做為新建立的page
```shell
$ hexo new [layout] <title>
```