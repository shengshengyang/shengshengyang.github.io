---
title: springboot 切換application.properties
date: 2023-12-19 10:30:15
tags:
- [maven]
- [springboot]
category:
- [java, springboot]
index_img: ../image/banner/springboot_maven_index.png
banner_img: ../image/banner/maven_banner.png
---
## application.properties
### 用途
放入spring 的配置，但時常本地開發 / 測試 / 正式的環境都會相差很多，因此在springboot可以設定不同的properties來做deploy 的區隔

### 配置檔
可以建立兩個properties 取名範例，properties 內容就自己放
#### application-local.properties
```text
server.port=8080
.....
```
#### application-prod.properties
```text
server.port=9090
.....
```

### maven 指令
只要切換target 就可以指向不同的properties
#### run
```shell
spring-boot:run -Dspring-boot.run.arguments=--spring.profiles.active=local
```
#### install
```shell
mvn clean install -P local
```
install 的問題比較多，因為最終如果要放到docker 的話，還是需要將.properties copy 到resources 中，需要再pom.xml中加入
步驟是
1. 將 -p 變數透過  <profiles> 設定好 local / prod
2. copy resources
3. 改名 resources 變成 application.properties

改名主要是不想再Dockerfile 中再做變數，取得需要的檔之後再變成相同的名字即可，`maven-antrun-plugin`就是用來改名的
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
            </plugin>
            <plugin>
                <artifactId>maven-antrun-plugin</artifactId>
                <version>1.8</version>
                <executions>
                    <execution>
                        <phase>prepare-package</phase>
                        <configuration>
                            <tasks>
                                <move file="${project.build.outputDirectory}/application-${active.profile}.properties"
                                      tofile="${project.build.outputDirectory}/application.properties"/>
                            </tasks>
                        </configuration>
                        <goals>
                            <goal>run</goal>
                        </goals>
                    </execution>
                </executions>
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
### Docker 
#### spring.config
更改完後就可以將copy file放入Dockerfile，在build 會帶入docker image
在跑的時候進入點使用
```shell
-Dspring.config.location=/application.properties
```
#### Dockerfile
就可以正確的使用properties來跑
```dockerfile
# Start with a base image containing Java runtime (Java 11)
FROM openjdk:11-jdk-slim

# Make port 8080 available to the world outside this container
EXPOSE 80

# The application's war file
ARG WAR_FILE=target/eip-0.0.1-SNAPSHOT.war

# Add the application's war to the container
ADD ${WAR_FILE} app.war

# Copy the properties files into the Docker image
COPY target/classes/application.properties /

# Run the war file
ENTRYPOINT ["java","-Dspring.config.location=/application.properties","-jar","/app.war"]

```

### ide 開發
若要在本地開起來，可以在configuration中的`Active profiles` 加入變數，就可以透過ide debug 並可以隨時切換環境
![](../image/intellij_active.png)