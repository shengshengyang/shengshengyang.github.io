---
title: java array 的功能實作
date: 2024-01-17 00:17:10
tags:
- [java]
- [data structure]
category:
- [java]
index_img: ../image/banner/java_index.jpg
banner_img: ../image/banner/java_banner_brown.jpg
---

# java 陣列

## 實作

### 宣告和初始化

在 Java 中，陣列的宣告和初始化可以如下所示：

```java
 int[]array=new int[5]; // 宣告一個大小為 5 的整數陣列
```

### 設定和獲取陣列元素

```java
array[0]=1; // 將第一個元素設為 1
int firstElement=array[0]; // 獲取第一個元素
```

### 獲取陣列長度

```java
int length=array.length; // 獲取陣列長度
```

### 遍歷陣列

```java
    for(int i=0;i<array.length;i++){
        System.out.println(array[i]); // 輸出每個元素
        }
```

### for-each

```java
    for(int element:array){
        System.out.println(element); // 輸出每個元素
        }
```

## 靈活性
如果你需要更多的操作，如添加元素、刪除元素、查找元素等，你可能需要使用 Java 的 ArrayList 類別