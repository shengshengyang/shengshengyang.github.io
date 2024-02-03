---
title: SortedMap NavigableMap
date: 2024-02-04 00:49:25
tags:
- [java]
- [data structure]
category:
- [java]
index_img: ../image/banner/java_index.jpg
banner_img: ../image/banner/java_banner_brown.jpg
---
Java 集合框架中的 SortedMap 和 NavigableMap 接口提供了映射（Map）的有序表示。

## SortedMap

`SortedMap` 接口擴展了 `Map` interface，提供了對鍵進行排序的能力。它保證映射中的鍵處於有序狀態，可以根據自然排序或者構造時提供的 Comparator 來定義排序規則。

### 特點
- 鍵按自然順序或根據 `Comparator` 進行排序。
- 提供了範圍查詢操作，如 headMap、tailMap 和 subMap，允許對映射的一部分進行操作。

### 範例: 客戶數據管理
考慮一個銀行系統，需要根據客戶的賬戶號碼來管理客戶數據，同時要求能夠快速獲取特定範圍內的客戶賬戶。
```java
import java.util.SortedMap;
import java.util.TreeMap;

public class CustomerDataManagement {
    public static void main(String[] args) {
        SortedMap<Integer, String> customerData = new TreeMap<>();
        
        // 添加客戶數據
        customerData.put(1003, "Alice");
        customerData.put(1002, "Bob");
        customerData.put(1001, "Charlie");
        customerData.put(1004, "Diana");

        // 獲取特定範圍內的客戶賬戶
        SortedMap<Integer, String> subCustomerData = customerData.subMap(1002, 1004);
        System.out.println("Sub customer data: " + subCustomerData);
    }
}

```

## NavigableMap

NavigableMap 接口進一步擴展了 `SortedMap` 接口，提供了更豐富的導航方法來定位映射中的鍵。

### 特點

- 提供了更精細的導航方法，如 lowerEntry、floorEntry、ceilingEntry 和 higherEntry。
- 支持逆序視圖，通過 descendingMap 方法獲得。

### 範例: 庫存管理系統

考慮一個銀行系統，需要根據客戶的賬戶號碼來管理客戶數據，同時要求能夠快速獲取特定範圍內的客戶賬戶。

```java
import java.util.SortedMap;
import java.util.TreeMap;

public class CustomerDataManagement {
    public static void main(String[] args) {
        SortedMap<Integer, String> customerData = new TreeMap<>();
        
        // 添加客戶數據
        customerData.put(1003, "Alice");
        customerData.put(1002, "Bob");
        customerData.put(1001, "Charlie");
        customerData.put(1004, "Diana");

        // 獲取特定範圍內的客戶賬戶
        SortedMap<Integer, String> subCustomerData = customerData.subMap(1002, 1004);
        System.out.println("Sub customer data: " + subCustomerData);
    }
}

```

### SortedMap 和 NavigableMap 的關係與比較




