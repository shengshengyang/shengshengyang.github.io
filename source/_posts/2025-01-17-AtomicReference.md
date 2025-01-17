---
title: AtomicReference 
date: 2025-01-17 14:26:02
tags:
- [java]
categories:
- [java]
index_img: ../image/banner/java_index.jpg
banner_img: ../image/banner/java_banner_brown.jpg
---

# AtomicReference

`AtomicReference` 是 Java 提供的一個原子類，用於封裝對象引用，並提供原子性操作（atomic operations）。它允許在多執行緒環境中安全地更新對象引用，避免競態條件的發生。

簡單來說，AtomicReference 是一個用於管理可變對象引用的工具，可以{%label danger @保證在更新時不會產生資料競爭%}。

## 使用方式

`AtomicReference` 提供了一個 `compareAndSet` 方法，用於比較當前值是否等於預期值，如果相等，則更新為新值。

```java
public class AtomicReferenceExample {
    public static void main(String[] args) {
        AtomicReference<String> atomicReference = new AtomicReference<>("initial value");

        String expectedValue = "initial value";
        String newValue = "new value";

        boolean isSuccess = atomicReference.compareAndSet(expectedValue, newValue);
        System.out.println("isSuccess: " + isSuccess); // true

        System.out.println("Current value: " + atomicReference.get()); // new value
    }
}
```

## 常用方法

- `compareAndSet`：比較當前值是否等於預期值，如果相等，則更新為新值。
- `get`：獲取當前值。
- `set`：設置新值。
- `getAndSet`：獲取當前值，並設置新值。
- `updateAndGet`：根據指定函數更新值，並獲取新值。

## 使用場景

### 1. 多執行緒需要共享變量的情況

當多個執行緒需要安全地讀取和更新某個變量時，AtomicReference 是一個很好的選擇。

### 2. 替代同步鎖

在一些需要原子性更新的場景中，AtomicReference 可以用來替代 synchronized 或顯式鎖。

### 3. Lambda 表達式或匿名函數中更新變量

在 Lambda 表達式或匿名函數中，變量必須是「最終的」或「有效的最終」（effectively final），這時可以用 AtomicReference
來包裝變量，使其可以在函數中被更新。

## 不使用的場景

### 1. 單執行緒程序

如果程式中只有一個執行緒操作變量，使用 AtomicReference 就顯得多餘，因為不需要擔心資料競爭。

### 2. 非原子性操作不需要同步

當對象引用的更新和讀取不需要保證原子性時，直接使用普通的變量即可，這樣效率更高。

### 3. 大量簡單操作

如果需要進行大量的簡單操作，AtomicReference 的額外開銷可能會導致性能下降。

## 範例

不使用 AtomicReference 的情況(需同步)：

```java
private String sharedVariable;

public synchronized void updateVariable(String newValue) {
    sharedVariable = newValue;
}
```

使用 AtomicReference 的情況：

```java
private final AtomicReference<String> sharedVariable = new AtomicReference<>();

public void updateVariable(String newValue) {
    sharedVariable.set(newValue);
}
```

### 重構

使用 synchronized 確保多執行緒的線程安全：

```java
public class SharedResource {
    private String sharedValue;

    public synchronized void updateSharedValue(String newValue) {
        this.sharedValue = newValue;
    }

    public synchronized String getSharedValue() {
        return this.sharedValue;
    }
}
```

使用 AtomicReference 重構：

```java
import java.util.concurrent.atomic.AtomicReference;

public class SharedResource {
    private final AtomicReference<String> sharedValue = new AtomicReference<>();

    public void updateSharedValue(String newValue) {
        sharedValue.set(newValue);
    }

    public String getSharedValue() {
        return sharedValue.get();
    }
}
```

#### 優點

- 使用 AtomicReference 可以避免使用 synchronized 關鍵字，提高程式的執行效率。
- 無死鎖風險：AtomicReference 不使用鎖，從根本上杜絕死鎖。
- 支持 Lambda 表達式：AtomicReference 可以在匿名函數中被安全地更新。

複雜條件的共享狀態更新

```java
public class StatusManager {
    private String status;

    public synchronized void updateStatus(String newStatus) {
        if ("READY".equals(newStatus) || "FAILED".equals(newStatus)) {
            this.status = newStatus;
        }
    }

    public synchronized String getStatus() {
        return this.status;
    }
}
```

使用 AtomicReference 重構並使用lambda：

```java
import java.util.concurrent.atomic.AtomicReference;

public class StatusManager {
    private final AtomicReference<String> status = new AtomicReference<>("INITIAL");

    public void updateStatus(String newStatus) {
        status.updateAndGet(current -> {
            if ("READY".equals(newStatus) || "FAILED".equals(newStatus)) {
                return newStatus;
            }
            return current;
        });
    }

    public String getStatus() {
        return status.get();
    }
}
```
