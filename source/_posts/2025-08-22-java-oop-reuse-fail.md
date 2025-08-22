---
title: Java 可變物件共享陷阱：JPA 實體類別的物件參考問題
date: 2025-08-22 17:59:34
tags:
- [java]
categories:
- [backend, Java]
index_img: ../image/banner/java_index.jpg
---

## 前言

在 Java 開發中，物件參考（Object Reference）是一個基礎概念，但也是最容易被忽略的陷阱來源。特別是在處理可變物件（Mutable Object）時，不當的物件共享會導致意想不到的副作用。

## 問題現象

### 典型的 Bug 場景

在 JPA 實體類別中，我們經常會看到這樣的程式碼：

```java
@Entity
@Table(name = "CONTACT_RF")
public class ContactRf {
    private Calendar insertDate;
    private Calendar updateDate;
    
    @PrePersist
    public void onPrePersist() {
        Calendar calendar = DateUtils.getUTCCalendar(Calendar.getInstance(), false);
        this.insertDate = calendar;        // 兩個欄位指向同一個物件
        this.updateDate = calendar;        // 這就是問題所在！
    }
    
    @PreUpdate
    public void onPreUpdate() {
        this.updateDate = DateUtils.getUTCCalendar(Calendar.getInstance(), false);
    }
}
```

### 觀察到的異常行為

新增一筆資料後，發現：
- `insertDate` 和 `updateDate` 的值竟然不相同
- 後續對物件的任何修改都會影響到之前設定的欄位
- 在不同的執行環境下，問題的表現可能不一致

## 根本原因分析

### 1. 物件參考共享的陷阱

問題的核心在於這行程式碼：

```java
Calendar calendar = DateUtils.getUTCCalendar(Calendar.getInstance(), false);
this.insertDate = calendar;
this.updateDate = calendar;
```

這裡發生了什麼：

```java
// 記憶體示意圖
Calendar object@123 = new Calendar(...)
insertDate -> object@123
updateDate -> object@123  // 指向同一個物件！
```

### 2. 可變物件的副作用

查看 `DateUtils.getUTCCalendar()` 的實作：

```java
public static Calendar getUTCCalendar(Calendar cal, boolean isQuerySql) {
    String offsetStr = AthenaConstants.getDBTZStr();
    // ... 處理邏輯
    cal.add(Calendar.HOUR_OF_DAY, Integer.parseInt(parts[0])); // 直接修改傳入物件！
    return cal; // 回傳被修改過的同一個物件
}
```

**關鍵問題**：
1. `Calendar` 是可變物件（Mutable Object）
2. 方法直接修改傳入的物件，而不是建立新物件
3. 回傳的是被修改過的同一個物件參考

### 3. 問題的連鎖反應

```java
// 執行流程分析
Calendar cal1 = Calendar.getInstance();           // cal1@456
Calendar result = DateUtils.getUTCCalendar(cal1, false); // 修改 cal1@456，回傳 cal1@456

this.insertDate = result;  // insertDate -> cal1@456
this.updateDate = result;  // updateDate -> cal1@456

// 之後任何對 cal1@456 的修改，都會同時影響 insertDate 和 updateDate！
```

## 解決方案詳解

### 方案 1：建立獨立物件實例（立即修復）

```java
@PrePersist
public void onPrePersist() {
    // 為每個欄位建立獨立的 Calendar 實例
    this.insertDate = DateUtils.getUTCCalendar(Calendar.getInstance(), false);
    this.updateDate = DateUtils.getUTCCalendar(Calendar.getInstance(), false);
}
```

**優點**：簡單、立即可用、不需修改現有工具類別
**缺點**：仍然依賴可變物件

### 方案 2：修改工具方法，實作防御性複製

```java
public static Calendar getUTCCalendar(Calendar cal, boolean isQuerySql) {
    // 防御性複製：建立新物件而不修改原物件
    Calendar newCal = (Calendar) cal.clone();
    
    String offsetStr = AthenaConstants.getDBTZStr();
    if (isQuerySql) {
        if (offsetStr.contains("+")) {
            offsetStr = offsetStr.replace('+', '-');
        } else {
            offsetStr = offsetStr.replace('-', '+');
        }
    }
    String[] parts = offsetStr.split(":");
    newCal.add(Calendar.HOUR_OF_DAY, Integer.parseInt(parts[0]));
    return newCal; // 回傳新物件
}
```

**優點**：從根源解決問題，避免副作用
**缺點**：需要修改既有的工具方法，可能影響其他程式碼

### 方案 3：使用不可變物件（最佳實務）

```java
@Entity
@Table(name = "CONTACT_RF")
public class ContactRf {
    
    @Column(name = "INS_DAT", updatable = false)
    private Instant insertDate; // Instant 是不可變物件
    
    @Column(name = "upd_dat")
    private Instant updateDate;
    
    @PrePersist
    public void onPrePersist() {
        Instant now = Instant.now(); // 每次都是新的實例
        this.insertDate = now;
        this.updateDate = now;       // 即使指向同一個實例也安全，因為 Instant 不可變
    }
}
```

**優點**：從設計上避免問題，執行緒安全
**缺點**：需要重構現有程式碼

## 相關的物件導向陷阱

### 1. 集合物件的淺複製問題

```java
// 危險的做法
private List<String> items = new ArrayList<>();

public List<String> getItems() {
    return items; // 直接回傳內部集合參考
}

// 安全的做法
public List<String> getItems() {
    return new ArrayList<>(items); // 防御性複製
}

// 或使用不可變集合
public List<String> getItems() {
    return Collections.unmodifiableList(items);
}
```

### 2. 建構子參數的可變物件問題

```java
// 有問題的建構子
public class Person {
    private Date birthDate;
    
    public Person(Date birthDate) {
        this.birthDate = birthDate; // 直接參考外部可變物件
    }
}

// 安全的建構子
public Person(Date birthDate) {
    this.birthDate = new Date(birthDate.getTime()); // 防御性複製
}
```

### 3. Getter/Setter 的物件洩露

```java
// 危險的 Getter
public Date getBirthDate() {
    return birthDate; // 洩露內部可變物件
}

// 安全的 Getter
public Date getBirthDate() {
    return new Date(birthDate.getTime());
}

// 更好的方案：回傳不可變物件
public LocalDate getBirthDate() {
    return birthDate; // LocalDate 是不可變的
}
```

## 檢測和預防策略

### 1. 程式碼審查檢查清單

- [ ] 是否有多個變數指向同一個可變物件？
- [ ] 工具方法是否修改傳入的參數？
- [ ] Getter 方法是否直接回傳內部可變物件？
- [ ] 是否使用了防御性複製？

### 2. 單元測試驗證

```java
@Test
public void testObjectReferenceIndependence() {
    ContactRf entity = new ContactRf();
    entity.onPrePersist();
    
    Calendar originalInsertDate = entity.getInsertDate();
    Calendar originalUpdateDate = entity.getUpdateDate();
    
    // 驗證是否為獨立物件
    assertNotSame("insertDate 和 updateDate 不應該是同一個物件", 
                  originalInsertDate, originalUpdateDate);
    
    // 修改其中一個，驗證另一個不受影響
    originalUpdateDate.add(Calendar.HOUR, 1);
    assertNotEquals("修改 updateDate 不應該影響 insertDate", 
                    originalInsertDate.getTime(), originalUpdateDate.getTime());
}
```

### 3. 靜態分析工具

使用 SpotBugs、SonarQube 等工具檢測：
- `EI_EXPOSE_REP`：回傳內部可變物件參考
- `EI_EXPOSE_REP2`：儲存外部可變物件參考

## 最佳實務建議

### 1. 優先使用不可變物件

```java
// 推薦：使用不可變物件
private final Instant timestamp = Instant.now();
private final String name = "example";
private final List<String> items = Collections.unmodifiableList(Arrays.asList("a", "b"));
```

### 2. 實作防御性複製

```java
// 防御性複製模式
public void setItems(List<String> items) {
    this.items = new ArrayList<>(items); // 複製傳入的集合
}

public List<String> getItems() {
    return new ArrayList<>(items); // 複製內部集合
}
```

### 3. 使用 Builder 模式

```java
@Builder(toBuilder = true)
public class ContactRf {
    private final Instant insertDate;
    private final Instant updateDate;
    
    // Builder 確保每次建立新實例
}
```

### 4. 明確的方法命名

```java
// 清楚表達意圖的方法名稱
public Calendar createUTCCalendar(Calendar source, boolean isQuerySql) {
    // 方法名稱明確表示會建立新物件
}

public void modifyToUTC(Calendar calendar, boolean isQuerySql) {
    // 方法名稱明確表示會修改傳入物件
}
```

## 總結

這個看似簡單的時間欄位問題，實際上反映了 Java 程式設計中的一個根本性問題：**可變物件的不當共享**。

### 問題的層次分析

1. **表面問題**：時間欄位值不一致
2. **直接原因**：物件參考共享
3. **根本原因**：可變物件設計和防御性程式設計的缺失

### 核心教訓

1. **物件參考是雙刃劍**：提高效能但增加複雜性
2. **可變物件需要謹慎處理**：特別是在多線程和物件共享場景
3. **防御性程式設計是必要的**：不要假設調用者會正確使用你的 API
4. **不可變物件是更安全的選擇**：從設計上避免副作用

這個案例提醒我們，在 Java 開發中，理解物件參考的行為和實作適當的物件管理策略是寫出穩定、可維護程式碼的基礎。
