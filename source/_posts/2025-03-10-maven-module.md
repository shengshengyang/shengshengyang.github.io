---
title: maven 多模組建立
date: 2025-03-10 16:07:43
tags:
- [spring security]
- [springboot]
category:
- [java, springboot]
index_img: ../image/banner/spring_banner.png
banner_img: ../image/banner/maven_banner.png
---

{%note success %}
前篇的想法
- **[spring 設計多階段建構及跨來源資源共享(CORS)](../../../../2024/12/27/spring-security-cors)**
{% endnote %}

## 前言

由於在同一個app 同時啟動後台及api, 考慮到未來維運的問題，因此嘗試將常用的module 分開，切分成以下這種架構

```text
backend/
   ├── pom.xml               // 父專案 pom，用來聚合所有後端模組
   ├── common/               // 共用邏輯（Entity、Repository）
   │   └── pom.xml
   ├── api/                  // 對外 API 模組
   │   └── pom.xml
   └── mvc/                  // 後台 MVC 模組
       └── pom.xml

```

這樣的好處是可以將共用的邏輯模組抽出來，並且可以獨立的部署，減少後續維護的困難度。

## pom.xml 設定

### 父專案 pom

定義主要的版本號，以及聚合模組，並將共用build plugin 設定在 pluginManagement 區塊中

```xml
<!-- backend/pom.xml -->
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!-- 父專案繼承 Spring Boot Starter Parent -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.4.3</version>
        <relativePath/>
    </parent>

    <groupId>com.dean</groupId>
    <artifactId>baby-development-backend</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>pom</packaging>
    <name>baby-development-backend</name>

    <!-- 聚合模組 -->
    <modules>
        <module>common</module>
        <module>api</module>
        <module>mvc</module>
    </modules>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            ...
        </dependencies>
    </dependencyManagement>
    <!-- 在 pluginManagement 區塊中設定共享的插件配置 -->
    <build>
        <pluginManagement>
            <plugins>
                <!-- Maven Compiler Plugin with Lombok configuration -->
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <version>3.10.1</version>
                    <configuration>
                        <source>${java.version}</source>
                        <target>${java.version}</target>
                        <annotationProcessorPaths>
                            <path>
                                <groupId>org.projectlombok</groupId>
                                <artifactId>lombok</artifactId>
                                <version>1.18.36</version>
                            </path>
                        </annotationProcessorPaths>
                    </configuration>
                </plugin>
                <!-- Spring Boot Maven Plugin 排除 Lombok -->
                <plugin>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-maven-plugin</artifactId>
                    <configuration>
                        <excludes>
                            <exclude>
                                <groupId>org.projectlombok</groupId>
                                <artifactId>lombok</artifactId>
                                <version>1.18.36</version>
                            </exclude>
                        </excludes>
                    </configuration>
                </plugin>
            </plugins>
        </pluginManagement>
    </build>
</project>
```

### 共用邏輯模組

作為可共用的jar, 可被api 及 mvc 模組引用, 連接同資料庫，達到解偶的效果

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.dean</groupId>
        <artifactId>baby-development-backend</artifactId>
        <version>0.0.1-SNAPSHOT</version>
    </parent>
    <artifactId>baby-development-common</artifactId>
    <packaging>jar</packaging>
    <name>baby-development-common</name>

    <dependencies>
        <!-- 例如，JPA 支援 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        ...
    </dependencies>
</project>
```

### API 模組

對外 API 模組，提供 RESTful 服務

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.dean</groupId>
        <artifactId>baby-development-backend</artifactId>
        <version>0.0.1-SNAPSHOT</version>
    </parent>
    <artifactId>baby-development-api</artifactId>
    <packaging>jar</packaging>
    <name>baby-development-api</name>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        ．．．
    </dependencies>
</project>
```

啟動class 需指定掃描，才能將所有的bean 載入

```java
@SpringBootApplication(scanBasePackages = {"com.dean.baby.api", "com.dean.baby.common"})
@EntityScan("com.dean.baby.common.entity")
@EnableJpaRepositories("com.dean.baby.common.repository")
public class BabyDevelopmentBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BabyDevelopmentBackendApplication.class, args);
    }

}
```

### MVC 模組

後台管理模組，使用 Thymeleaf 建構管理介面與自訂登入頁面

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.dean</groupId>
        <artifactId>baby-development-backend</artifactId>
        <version>0.0.1-SNAPSHOT</version>
    </parent>
    <artifactId>baby-development-mvc</artifactId>
    <packaging>jar</packaging>
    <name>baby-development-mvc</name>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>

```

一樣需指定掃描，才能將所有的bean 載入

```java
@SpringBootApplication(scanBasePackages = {"com.dean.baby.mvc", "com.dean.baby.common"})
@EntityScan("com.dean.baby.common.entity")
@EnableJpaRepositories("com.dean.baby.common.repository")
public class BabyDevelopmentMvcApplication {

	public static void main(String[] args) {
		SpringApplication.run(BabyDevelopmentMvcApplication.class, args);
	}

}
```

## 建置與運行

### 建置所有模組

在 `backend` 目錄下執行以下命令，進行專案編譯與打包：

```bash
mvn clean install
```

### 運行單一模組

#### API 模組

```text
cd backend/api

mvn spring-boot:run
```
    
#### MVC 模組

```text
cd backend/mvc

mvn spring-boot:run
```

## 結論

透過 Maven 多模組架構管理，可以將專案切分成多個模組，並且可以獨立部署，減少後續維護的困難度。
