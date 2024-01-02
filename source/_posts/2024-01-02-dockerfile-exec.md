---
title: dockerfile cmd 與 entrypoint 的比較
date: 2024-01-02 23:39:23
tags:
- [backend]
- [docker]
- [Dockerfile]
category:
- [docker]
index_img: ../image/banner/docker_index.jpg
banner_img: ../image/banner/docker_banner.png
---
## 啟動命令
- 啟動時默認執行
- 如果再docker 起來時啟動了其他命令，CMD內建的指令會被取代
- 就算定義了多個CDM 只有 {% label danger @最後一個 %} 會被執行

`CMD` 指令用於指定容器執行時默認的命令。它可以有三種不同的格式：

### EXEC
```dockerfile
CMD ["executable","param1","param2"]
```

### shell
```dockerfile
CMD command param1 param2
```

### 執行時輸入的命令
在 docker run 命令中指定的命令會覆蓋 Dockerfile 中的 CMD。

#### example
- dockerfile
  ```dockerfile
  FROM ubuntu:20.04
  ENV VERSION=2.0.1
  RUN apt-get update && \
  apt-get install -y wget && \
  wget https://github.com/ipinfo/cli/releases/download/ipinfo-${VERSION}/ipinfo_${VERSION}_linux_amd64.tar.gz && \
  tar zxf ipinfo_${VERSION}_linux_amd64.tar.gz && \
  mv ipinfo_${VERSION}_linux_amd64 /usr/bin/ipinfo && \
  rm -rf ipinfo_${VERSION}_linux_amd64.tar.gz
  ```
- CMD
  ```shell
  $ docker image build -t ipinfo .
  $ docker container run -it ipinfo
  root@8cea7e5e8da8:/#
  root@8cea7e5e8da8:/#
  root@8cea7e5e8da8:/#
  root@8cea7e5e8da8:/# pwd
  /
  root@8cea7e5e8da8:/#
  ```
- optput
  ```shell
  $docker image history ipinfo
  IMAGE          CREATED        CREATED BY                                      SIZE      COMMENT
  db75bff5e3ad   24 hours ago   RUN /bin/sh -c apt-get update &&     apt-get…   50MB      buildkit.dockerfile.v0
  <missing>      24 hours ago   ENV VERSION=2.0.1                               0B        buildkit.dockerfile.v0
  <missing>      7 days ago     /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B
  <missing>      7 days ago     /bin/sh -c mkdir -p /run/systemd && echo 'do…   7B
  <missing>      7 days ago     /bin/sh -c [ -z "$(apt-get indextargets)" ]     0B
  <missing>      7 days ago     /bin/sh -c set -xe   && echo '#!/bin/sh' > /…   811B
  <missing>      7 days ago     /bin/sh -c #(nop) ADD file:d6b6ba642344138dc…   74.1MB
  ```

## Entrypoint
ENTRYPOINT 指令用於設定容器啟動時執行的命令。它也有兩種格式：

### exec 格式（推薦）
在 Dockerfile 中使用 JSON 數組的形式。例如：

```dockerfile
ENTRYPOINT ["executable","param1","param2"]
```
### shell 格式

```dockerfile
ENTRYPOINT command param1 param2
```

## 兩者比較
`ENTRYPOINT` 與 `CMD` 的不同之處在於，`ENTRYPOINT` 會把容器啟動時的命令視為其參數，而 `CMD` 僅提供默認值，可以被 docker run 命令中指定的命令覆蓋。

### 表格

| 特性                 | CMD                      | ENTRYPOINT               |
|----------------------|--------------------------|--------------------------|
| 能否被 `docker run` 覆蓋 | 是                       | 是                       |
| exec 格式推薦         | 是                       | 是                       |
| shell 格式支持         | 是                       | 是                       |
| 預設命令              | 可以有，提供默認值       | 可以有，提供默認值       |
| 容器啟動時的參數      | 用於覆蓋 CMD 的默認值    | 視為 ENTRYPOINT 的參數    |

