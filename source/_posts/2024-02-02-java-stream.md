---
title: Java Stream API
date: 2024-02-02 00:51:12
tags:
- [java]
- [lambda]
category:
- [java]
index_img: ../image/banner/java_index.jpg
banner_img: ../image/banner/java_banner_brown.jpg
---

# Stream Api

## 主要特點

- 不存儲數據：Stream 本身不會存儲元素。它只是在原有的數據源上（例如集合、數組）進行操作的工具。

- 函數式編程：Stream API 大量使用 Lambda 表達式，支持函數式編程的概念，使得編寫的代碼既簡潔又易於理解。

- 惰性求值：很多 Stream 操作都是延遲執行的，只有在需要結果的時候才會實際執行，這有助於優化性能。

- 可串行可並行：Stream 可以進行串行處理，也可以輕鬆轉換為並行處理，利用多核處理器來加速數據處理速度。

## 中間操作 Intermediate Operations

這些操作會返回一個新的 Stream 對象。常見的中間操作包括 `filter`（過濾）、`map`（映射）、`sorted`（排序）等。

### 特點

1. java 允許 `0個或多個` Intermediate Operations

2. 大型數據的 `Operations 順序`會有影響: 先 filter, 後sort() 或 map()

3. 非常大的數據集使用 `ParallelStream`，啟用多個thread`

### stream().filter()

`filter`：過濾元素

從用戶名單中選出以特定字母開頭的用戶，例如為了發送定制化的郵件。

```java
List<String> names=Arrays.asList("John","Jane","Adam","Diana");
        List<String> filteredNames=names.stream()
        .filter(name->name.startsWith("J"))
        .collect(Collectors.toList());
// 結果: ["John", "Jane"]
```

### stream().map()

`map`：將元素轉換成其他形式或提取信息。map：將元素轉換成其他形式或提取。

從用戶名生成電子郵件地址。

```java
List<String> emails=names.stream()
        .map(name->name.toLowerCase()+"@example.com")
        .collect(Collectors.toList());
// 結果: ["john@example.com", "jane@example.com", "adam@example.com", "diana@example.com"]

```

### stream().sort()

`sorted`：對元素進行排序。

對產品價格或者用戶生成的數據進行排序，以便後續處理。

```java
List<Integer> numbers=Arrays.asList(4,2,3,1,5);
        List<Integer> sortedNumbers=numbers.stream()
        .sorted()
        .collect(Collectors.toList());
// 結果: [1, 2, 3, 4, 5]
```

## 終端操作 terminal operator

這些操作會產生一個結果或副作用，例如 forEach（遍歷）、collect（收集到集合）、count（計數）、reduce（累加）等。

### 特點

1. 只允許一個終端操作

2. foreach()對每個元素做相同的操作

3. Collect將元素保存到集合中

4. 其他選項將stream縮減為單一結果

### stream().foreach()

`forEach`：對每個元素執行操作。

遍歷用戶名單執行某些操作，例如發送通知。

```java
names.stream()
        .forEach(System.out::println);
```

### stream().collect

`collect`：將流轉換成其他形式，如列表或集合。

將過濾後的結果集合起來，以供後續處理。

```java
List<String> collectedNames=names.stream()
        .collect(Collectors.toList());
```

### stream().reduce

`reduce`：將所有元素合併為一個結果。

計算一系列交易的總和。

```java
Integer sum=numbers.stream()
        .reduce(0,Integer::sum);
// 結果: 15
```

## 綜合例子

假設我們有一個訂單列表，每個訂單包含價格和類別，我們想要計算每個類別的總銷售額

```java
package Collection.Stream;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

class Order {
    String category;
    double price;

    public Order(String category, double price) {
        this.category = category;
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public double getPrice() {
        return price;
    }
}

class Main {
    public static void main(String[] args) {
        List<Order> orders = Arrays.asList(
                new Order("Electronics", 200.0),
                new Order("Clothing", 75.0),
                new Order("Electronics", 150.0),
                new Order("Toys", 50.0)
        );

        Map<String, Double> totalSalesByCategory = orders.stream()
                .collect(Collectors.groupingBy(Order::getCategory,
                        Collectors.summingDouble(Order::getPrice)));
        System.out.println(totalSalesByCategory);
    }
}

```