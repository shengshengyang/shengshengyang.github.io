---
title: docker 鏡像的多層次建構
date: 2024-01-03 23:24:53
tags:
- [backend]
- [docker]
- [Dockerfile]
category:
- [docker]
index_img: ../image/banner/docker_index.jpg
banner_img: ../image/banner/docker_banner.png
---
## 緩存
### dockerfile 順序
Docker在建構鏡像時會使用快取機制，如果某一層的指令沒有變化

#### dockerfile(較差)
由於copy 擺在前面，所以每當檔案有變動時，後面的安裝包就不會使用catch 去跑

  ```dockerfile
  # Dockerfile_with_cache
  
  # 基底映像
  FROM ubuntu:20.04
  # 複製應用程式碼到容器中
  COPY . /app
  
  # 安裝必要的軟體包
  RUN apt-get update && apt-get install -y \
      package1 \
      package2 \
      package3

  # 設定工作目錄
  WORKDIR /app
  
  # 執行應用程式啟動命令
  CMD ["./start.sh"]
  ```
  
#### dockerfile(較優)

此時 app即使有變動，前面的install 沒有變動所以可以自動使用catch，簡煥build 時間

  ```dockerfile
  # Dockerfile_with_cache
  
  # 基底映像
  FROM ubuntu:20.04
  
  # 安裝必要的軟體包
  RUN apt-get update && apt-get install -y \
      package1 \
      package2 \
      package3
  
  # 複製應用程式碼到容器中
  COPY . /app
  
  # 設定工作目錄
  WORKDIR /app
  
  # 執行應用程式啟動命令
  CMD ["./start.sh"]
  ```

#### dockerfile(強制不使用緩存)

透過隨機的 ARG 標籤來達到強制重新安裝的效果

  ```dockerfile
  # Dockerfile_without_cache
  
  # 基底映像
  FROM ubuntu:20.04
  
  # 強制不使用快取的隨機標籤
  ARG CACHEBUST=1
  
  # 安裝必要的軟體包
  RUN apt-get update && apt-get install -y \
  package1 \
  package2 \
  package3
  
  # 複製應用程式碼到容器中
  COPY . /app
  
  # 設定工作目錄
  WORKDIR /app
  
  # 執行應用程式啟動命令
  CMD ["./start.sh"]
  
  ```

## .dockerignore
### Docker Build Contex
Docker build context 是指在建構 Docker 鏡像時，Docker Daemon 所使用的檔案和目錄的上下文（context）。這個上下文包括 {% label danger @Dockerfile 所在的目錄以及其下的所有檔案和子目錄 %}。當執行 `docker build` 指令時，這個上下文將被傳送到 Docker Daemon，以便在建構過程中使用

如果其中包含了不必要的檔案就會造成建構變慢，因此就會需要使用 {% label info @dockerignore %} 來減少傳入的檔案  

### dockerignore
用來指定在建構 Docker 鏡像時應該被排除的檔案和目錄，會有以下常見應用

#### 減少上下文大小
在一個大型應用程式的項目中，只將 Dockerfile 所需的檔案包含在上下文中，並使用 .dockerignore 來排除不必要的檔案，這樣可以大幅減小上下文的大小，提高建構效能。
#### 保護隱私
如果在項目中包含了敏感資訊（例如密碼、私鑰等），通過 .dockerignore 可以確保這些敏感資訊不被包含在上下文中，從而防止它們洩漏到 Docker Daemon。
#### 提高網路效能
當上下文較大時，建構鏡像可能需要將大量數據傳輸到 Docker Daemon。通過減小上下文的大小，可以減少網絡流量，尤其對於遠程 Docker Daemon 更為重要。
#### 範例
```.ignorelang
# 忽略所有的測試檔案
test/

# 忽略編譯產生的檔案
*.pyc
*.class

# 忽略版本控制系統的隱藏檔
.git/
.svn/

# 忽略敏感資訊
secrets.txt

```