---
title: 用springboot直接build docker image
date: 2023-12-19 17:04:19
tags:
- [maven]
- [springboot]
- [docker]
category:
- [java, springboot]
- [docker]
index_img: ../image/banner/docker_index.jpg
banner_img: ../image/banner/docker_banner.png
---
## Spring boot
### pom.xml
這邊接續上篇[springboot 切換application.properties](https://shengshengyang.github.io/2023/12/19/springboot-maven-properties/), 於是pom 檔中會需要辨別`local`及`prod`
設定好之後可以在 <configuration> 中決定 name
```xml
 <build>
        <resources>
            <resource>
                <directory>src/main/resources/config</directory>
                <filtering>true</filtering>
                <includes>
                    <include>application-${active.profile}.properties</include>
                </includes>
            </resource>
        </resources>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <image>
                        <name>df-eip</name>
                    </image>
                </configuration>
            </plugin>
        </plugins>
    </build>
    <profiles>
        <profile>
            <id>local</id>
            <properties>
                <active.profile>local</active.profile>
            </properties>
        </profile>
        <profile>
            <id>prod</id>
            <properties>
                <active.profile>prod</active.profile>
            </properties>
        </profile>
    </profiles>
```
### build docker image
使用springboot 的指令即可建置出image 
```shell
spring-boot:build-image -P local
```
首次建會載`image 'docker.io/paketobuildpacks/builder:base` 會花不少時間， 建完之後查看
```shell
docker image ls
```
- output
  | REPOSITORY | TAG    | IMAGE ID    | CREATED       | SIZE  |
  |------------|--------|-------------|---------------|-------|
  | df-eip-app | latest | 23d63a5da6d9 | 53 minutes ago | 463MB |

### docker compose
```yaml
version: '3'
services:
  app:
    image: df-eip:latest
    ports:
      - "80:80"
    depends_on:
      - redis
  redis:
    image: "redis:alpine"
    ports:
      - "6379:6379"

```
#### docker run
```shell
docker-compose up
```

### Docker 啟動!
