---
title: SpringBoot連接MariaDB
date: 2023-11-30 15:46:18
tags:
- [SpringBoot]
- [MariaDb]
- [nas]
categories:
- [java, springBoot]
- [Database, MariaDb]
---
原先是想用mySQL, 無奈於購置的synology nas 型號沒有預設支援，僅有mariaDB 可以裝，於是就開始了連接的過程

1.啟動synology 內的mariaDB,並設定root 使用者及密碼

2.利用ssh 進入nas
```
ssh dean@xxx.xxx.x.xxx
```
<!--more-->
3.進入DB後可查詢現在的user
```
mysql --user=root -p
SELECT User, Host FROM mysql.user;
```
會向下列的表列出現有的user 以及對應的ip,預設如下，僅有本機（127.0.0.1）可進入
```
+--------------+--------------+
| user         | host         |
+--------------+--------------+
| root         | 127.0.0.1    |
| root         | ::1          |
| root         | localhost    |
+--------------+--------------+
```
4.新增一位user 及想要對應的port,並取得密碼，若要開放全部就使用x.x.x.%, 但基於安全不建議
```
CREATE USER 'root'@'x.x.x.%' IDENTIFIED BY '{密碼}'
```
5.新增帳號會缺少權限導致hibernate 無法做變更，因此需要新增權限,新增後刷新權限
```
GRANT ALL PRIVILEGES ON *.* TO 'root'@'x.x.x.%' WITH GRANT OPTION; 
FLUSH PRIVILEGES;
```
6.如此一來就可以測試連線了, 我是使用intellij 內建的db連線工具

7.application.yml 配置
```
spring:
  datasource:
    driver-class-name: org.mariadb.jdbc.Driver
    url: jdbc:mariadb://localhost:3306/<your_scheme>
    username: <your_account>
    password: <your_password>
  jpa:
    hibernate:
      ddl-auto: <your_mode>
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL5InnoDBDialect
```
這途中有鬧點小插曲，因為一直出現access deny use password (no), 本來覺得是不是版本的問題，試了不同的driver,最後發現是因為我的密碼是＃開頭, yml會做自動辨識造成讀不出來，最後用字串包起來後就解決了

8.Dialect的決定
針對Hibernate 5.2 以前的版本使用
```
org.hibernate.dialect.MySQL5InnoDBDialect
```
以後的版本使用
```
org.hibernate.dialect.MariaDBDialect
```