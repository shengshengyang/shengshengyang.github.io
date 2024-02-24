---
title: 用docker image 建 mysql 資料庫
date: 2024-02-25 00:13:04
tags:
- [backend]
- [docker]
- [mysql]
category:
- [docker]
index_img: ../image/banner/docker_index.jpg
banner_img: ../image/banner/docker_banner.png
---
> 如果是windows 請先安裝 docker desktop

## 流程
### image
因為有點懶得直接安裝，所以透過docker image 直接拉最新的`image`

```shell
docker pull mysql:latest
```
### container

run container 並定義密碼
```shell
docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=your_password -d mysql:latest
```
### exec

進入並開始使用
```shell
docker exec -it mysql-container mysql -uroot -pyour_password
```

### expose

若要expose 到外面
```shell
docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=your_password -p 3306:3306 -d mysql:latest
```

### create user
```shell
CREATE USER 'test'@'%' IDENTIFIED BY 'test';  
```

### 設定權限
```shell
GRANT ALL PRIVILEGES ON testdb.* TO 'test'@'%';
FLUSH PRIVILEGES;
```