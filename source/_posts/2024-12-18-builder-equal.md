---
title: Builder 的比較
date: 2024-12-18 15:27:37
tags:
- [java]
- [lombok]
category:
- [java]
index_img: ../image/banner/lombok_index.webp
banner_img: ../image/banner/lombok_banner.png
---
## builder 的相等情況

範例
```java
@Builder(toBuilder = true)
public class User {
    private String username;
    private String email;
    private int age;
}

User user = User.builder()
                .username("john_doe")
                .email("john.doe@example.com")
                .age(25)
                .build();

User updatedUser = user.toBuilder()
                       .age(30)  // 修改 age
                       .build();
```

### 未定義equal
toBuilder() 創建了一個新對象，它與原始對象 user 不共享內存位置。
```java
System.out.println(user.equals(updatedUser)); // 默認情況下，結果為 false
```

### @EqualsAndHashCode

```java
import lombok.Builder;
import lombok.EqualsAndHashCode;

@Builder(toBuilder = true)
@EqualsAndHashCode
public class User {
    private String username;
    private String email;
    private int age;
}

User user = User.builder()
                .username("john_doe")
                .email("john.doe@example.com")
                .age(25)
                .build();

User updatedUser = user.toBuilder()
                       .age(30)  // 修改 age
                       .build();

System.out.println(user.equals(updatedUser)); // false

```
結果：false

因為 age 的值不同，equals() 方法會將它視為不相等。

#### 比較基於主鍵的對象

通常在 JPA 實體中，對象的 equals() 方法會根據主鍵（id）來比較對象，而不是全部屬性。可以使用 @EqualsAndHashCode 的 onlyExplicitlyIncluded 參數來控制比較邏輯。

```java
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Builder(toBuilder = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString
public class User {
    @EqualsAndHashCode.Include
    private Long id;
    private String username;
    private String email;
    private int age;
}

User user = User.builder()
                .id(1L)
                .username("john_doe")
                .email("john.doe@example.com")
                .age(25)
                .build();

User updatedUser = user.toBuilder()
                       .age(30)  // 修改 age
                       .build();

System.out.println(user.equals(updatedUser)); // true
```
解釋：
@EqualsAndHashCode.Include：指定僅使用 id 屬性進行比較。
結果：true，因為兩個對象的 id 相同，其他屬性值的差異會被忽略。


## 結論

- tobuilder 產生新的實例，所以比較記憶體位置會不同
- 可以透過`@EqualsAndHashCode` 相關應用來定義equal