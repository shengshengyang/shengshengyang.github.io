---
title: docker volumn /
date: 2024-01-07 00:01:01
tags:
- [backend]
- [docker]
category:
- [docker]
index_img: ../image/banner/remote_explorer_index.png
banner_img: ../image/banner/docker_banner.png

---

# docker 的儲存

##  {% label danger @docker volume %}

Docker Volume 是一種持久性資料存儲方式，允許容器之間或容器和主機之間共享資料。

### 建立docker volume

```shell
docker volume create mydata
```

### 掛載容器到volume

{% label danger @-v %} 這將運行一個以 `Ubuntu` 為基礎的容器，同時將 `mydata Volume` 掛載到容器內的 `/app/data` 目錄。

```shell
docker run -it --name mycontainer -v mydata:/app/data ubuntu
```

### 在容器內將資料傳入 Volume

在容器中，你可以使用基本的檔案操作命令或其他工具將資料傳入 Volume。例如，在容器內建立一個檔案：

```shell
echo "Hello, Docker Volume!" > /app/data/myfile.txt
```

### 確認資料是否有傳入

```shell
docker volume inspect mydata
```

### spring log 自動掛載

#### 1. 確定 Spring Boot 專案的日誌檔案目錄

在 Spring Boot 專案中，通常預設的日誌檔案目錄是 ./logs。可以在 `application.properties` 或 `application.yml` 中進行配置。

```properties
logging.file.name=app.log
```

或

```yaml
logging:
  file:
    name: app.log
```

#### 2. 建立volume
```shell
docker volume create mylogs
```

#### 3. 運行 Spring Boot 容器，掛載 Volume
```shell
docker run -d --name myspringapp -v mylogs:/path/to/logs -p 8080:8080 my-spring-image
```

這樣一來即使容器被移除，log 依然會被持久化保存

## {% label info @Bind mount %}
### 特點
- 資料保存位置：在主機檔案系統中的特定目錄。
- 生命週期：與容器生命週期相關聯，容器停止後 Bind Mount 不再存在。
- 建立方式：直接指定主機上的目錄，無需額外創建。
### 應用
假設有一個 Spring Boot 專案，你想要在本機進行開發並實時查看程式碼變更，同時讓 Spring Boot 容器能夠即時反映這些變更。
#### 1. 確保 Spring Boot 專案的程式碼在主機上的目錄
假設 Spring Boot 專案的程式碼在主機上的路徑為 `/path/to/spring-app`
#### 2. 運行 Spring Boot 容器，掛載 Bind Mount
```shell
docker run -d --name myspringapp -v /path/to/spring-app:/app -p 8080:8080 my-spring-image
```
`/path/to/spring-app` 是主機上的專案程式碼目錄，`/app` 是容器內的指定路徑。

#### 3. 連結 Spring Boot
瀏覽器訪問 `http://localhost:8080`，即可查看 Spring Boot 專案運行的結果。由於 Bind Mount 的特性，當你修改本機上的程式碼時，容器內的程式碼也會同步更新，實現開發時的即時反映。

## 比較
| 特性                  | Volume                            | Bind Mount                           |
|----------------------|-----------------------------------|--------------------------------------|
| **資料保存位置**        | 在 Docker 主機的特定目錄中             | 任何主機上的特定目錄                   |
| **生命週期**           | 可以存在於容器內或外，持久存儲       | 依附於容器，容器停止後便不再存在        |
| **建立方式**           | 使用 `docker volume create` 命令    | 直接指定主機上的目錄                    |
| **內容初始化**         | 可以使用 Dockerfile 中的 `VOLUME` 指令 | 需要手動在主機上創建並初始化             |
| **擴展性**             | 支持使用第三方插件擴展              | 只是主機上的目錄，擴展性較有限          |
| **使用情境**           | 適用於需要保留資料的應用，如資料庫    | 適用於開發和測試環境，容器停止後資料不需要保留 |
| **語法範例**           | `docker run -v mydata:/app/data`   | `docker run -v /host/data:/app/data` |


