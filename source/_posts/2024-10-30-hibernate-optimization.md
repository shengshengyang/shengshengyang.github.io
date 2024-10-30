---
title: hibernate-optimization
date: 2024-10-30 21:20:09
tags:
- [sql]
- [mysql]
- [hibernate]
category:
- [sql]
- [hibernate]
index_img: ../image/banner/sql_index.webp
banner_img: ../image/banner/sql_banner.png
---
# Hibernate / Data Jpa 的優化

## Join 

在 orm 中 方便使用會透過`@ManyToOne` 或 `ManyToMany`等方式去做方便的查詢，但在mapping 多及資料涉及範圍廣的時候，常常會造成降速，原因為容易造成{%label danger @N+1 %} 查詢

```java
@Entity
public class User {
    @Id
    private Long id;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private Set<Order> orders;
    // 其他屬性和方法
}

@Entity
public class Order {
    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    // 其他屬性和方法
}

```

如果要找到訂單，orm會有兩種方式

### FetchType.LAZY（延遲加載）


- 當實體加載時，LAZY 抓取的關聯數據不會立即從資料庫中取出。
- 真正訪問到該屬性時，Hibernate 才會發出額外的查詢去獲取所需的關聯資料。

```java

List<User> users = userRepository.findAll();
for (User user : users) {
    Set<Order> orders = user.getOrders();
    // 處理訂單
}
```
上述程式碼將會產生 N+1 次查詢：

1 次查詢：`SELECT * FROM User` 
N 次查詢：對於每個用戶，當調用 `user.getOrders()` 時，會執行 `SELECT * FROM Order WHERE user_id = ?`

如果有 100 個用戶，總共會執行 101 次查詢，這就是 N+1 問題。

### FetchType.EAGER（立即加載）

在查詢主實體的同時立即將關聯資料一同抓取，避免了後續的延遲加載問題。

主動join 適合在實體對應的關聯資料量小且需要立即使用的場景中

```java
@Entity
public class User {
    @Id
    private Long id;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private Set<Order> orders;
    // 其他屬性和方法
}

```

### Fetch Join

在查詢中使用 JOIN FETCH 關鍵字，一次性抓取關聯的資料，可避免N+1

```java
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.orders")
    List<User> findAllUsersWithOrders();
}
```

`LEFT JOIN FETCH u.orders` 指示 Hibernate 在查詢每個 User 時，同時抓取`每個 User 的所有 Order`，即使在model 設定是lazy fetch, 仍可以直接抓到資料

### Native Query 

1. 使用 UserRepository.findAllUsers() 獲取所有用戶。
2. 使用 OrderRepository.findOrdersByUserIds() 查詢這些用戶的訂單。
3. 將訂單按 user_id 分組並映射回對應的 User。

```java
public interface UserRepository extends JpaRepository<User, Long> {
    @Query(value = "SELECT * FROM User", nativeQuery = true)
    List<User> findAllUsers();
}
```

```java
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query(value = "SELECT * FROM Order WHERE user_id IN :userIds", nativeQuery = true)
    List<Order> findOrdersByUserIds(@Param("userIds") List<Long> userIds);
}

```

```java
// Step 1: 查詢所有 User
List<User> users = userRepository.findAllUsers();
List<Long> userIds = users.stream().map(User::getId).collect(Collectors.toList());

// Step 2: 查詢所有訂單並根據 userId 分組
List<Order> orders = orderRepository.findOrdersByUserIds(userIds);
Map<Long, List<Order>> ordersByUserId = orders.stream().collect(Collectors.groupingBy(order -> order.getUser().getId()));

// Step 3: 將訂單集合映射到 User 中
for (User user : users) {
    user.setOrders(ordersByUserId.get(user.getId()));
}

```

#### 優勢：

- 透過一次查詢獲取所有 User 和 Order，有效避免 N+1 問題。
- 查詢更高效，數據一次性載入且只需在應用層進行分組映射。
#### 劣勢：

- code複雜性。
- 資料庫移植困難