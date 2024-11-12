---
title: transactional-isolation
date: 2024-11-12 00:34:21
tags:
- [backend]
- [java]
- [spring]
categories:
- [java]
index_img: ../image/banner/java_index.jpg
banner_img: ../image/banner/java_banner_brown.jpg
---
[@Transactional前文](../../../../2024/11/10/transactional)
# isolation

`isolation` 是 Spring `@Transactional` 註解中的一個屬性，用於設定事務的隔離級別。事務的隔離級別決定了事務在併發環境中如何與其他事務交互，從而避免資料不一致或資料競爭的問題。`DEFAULT`：使用後端數據庫的默認隔離級別。

* 在資料庫中，常見的隔離級別有：

    * **READ_UNCOMMITTED（未提交讀）**

    * **READ_COMMITTED（提交讀）**

    * **REPEATABLE_READ（可重複讀）**

    * **SERIALIZABLE（可串行化）**

  每個隔離級別都對應著不同的併發現象，選擇適當的隔離級別可以在性能和資料一致性之間取得平衡。

## **併發問題和隔離級別**

在多事務併發的情況下，可能會出現以下併發問題：

1. **髒讀（Dirty Read）**：一個事務讀取了另一個事務未提交的變更數據。

2. **不可重複讀（Non-Repeatable Read）**：在同一事務中，多次讀取同一資料，結果卻不同，因為其他事務修改並提交了該資料。

3. **幻讀（Phantom Read）**：在同一事務中，執行相同的查詢兩次，結果卻不同，因為其他事務插入或刪除了資料，導致查詢結果集變化。

不同的隔離級別可以防止不同的併發問題：

* **READ_UNCOMMITTED**：不防止任何併發問題。

* **READ_COMMITTED**：防止髒讀。

* **REPEATABLE_READ**：防止髒讀和不可重複讀。

* **SERIALIZABLE**：防止髒讀、不可重複讀和幻讀。

## 種類

###  **READ_UNCOMMITTED（未提交讀）**
#### **含義：**

* **未提交讀**：事務可以讀取到其他事務尚未提交的變更數據。

#### **特點：**

* 可能會發生髒讀、不可重複讀和幻讀。

* 併發控制最弱，性能最高，但資料一致性最差。

#### **使用場景：**

* 資料一致性要求極低，允許讀取臨時的、不一致的數據。

* 幾乎不使用，因為可能導致嚴重的資料不一致。

**範例：**

```java
@Transactional(isolation = Isolation.READ_UNCOMMITTED)
public List<Product> getAllProducts() {
    // 查詢所有產品
    return productRepository.findAll();
```

* 在該方法中，可能讀取到其他事務未提交的產品資料。

### **READ_COMMITTED（提交讀）**

#### **含義：**

* **提交讀**：事務只能讀取到其他事務已提交的數據。

#### **特點：**

* 防止髒讀。

* 可能發生不可重複讀和幻讀。

* 大多數資料庫（如 Oracle、SQL Server）的默認隔離級別。

#### **使用場景：**

* 資料一致性要求一般，不允許髒讀，但允許不可重複讀和幻讀。

#### **範例：**

```java
@Transactional(isolation = Isolation.READ_COMMITTED)
public Account getAccountById(Long id) {
    // 根據 ID 查詢帳戶
    return accountRepository.findById(id).orElse(null);
}
```
* 在該方法中，確保讀取的帳戶資料是其他事務已提交的，不會讀到未提交的變更。

### **REPEATABLE_READ（可重複讀）**

#### **含義：**

* **可重複讀**：在同一事務中，多次讀取同一資料，結果相同。

#### **特點：**

* 防止髒讀和不可重複讀。

* 可能發生幻讀。

* MySQL InnoDB 的默認隔離級別。

#### **使用場景：**

* 資料一致性要求較高，需要保證同一事務中多次讀取資料結果一致。

**範例：**

```java
@Transactional(isolation = Isolation.REPEATABLE_READ)
public void checkInventory(Long productId) {
    // 第一次查詢庫存
    int initialStock = inventoryRepository.getStockByProductId(productId);
    
    // 執行其他操作，可能有其他事務修改庫存
    
    // 第二次查詢庫存
    int laterStock = inventoryRepository.getStockByProductId(productId);
    
    // initialStock 和 laterStock 應該相同
}
```
* 在該方法中，兩次讀取相同的庫存數量，結果應該一致，防止不可重複讀。

### **SERIALIZABLE（可串行化）**

#### **含義：**

* **可串行化**：最高的隔離級別，所有事務按順序執行，避免所有併發問題。

#### **特點：**

* 防止髒讀、不可重複讀和幻讀。

* 併發性能最差，可能導致大量的鎖定和阻塞。

#### **使用場景：**

* 資料一致性要求極高，且可以接受較低的併發性能。

#### **範例：**

```java
@Transactional(isolation = Isolation.SERIALIZABLE)
public void transferFunds(Long fromAccountId, Long toAccountId, BigDecimal amount) {
    // 從來源帳戶扣款
    Account fromAccount = accountRepository.findById(fromAccountId).orElseThrow();
    fromAccount.debit(amount);
    accountRepository.save(fromAccount);
    
    // 向目標帳戶存款
    Account toAccount = accountRepository.findById(toAccountId).orElseThrow();
    toAccount.credit(amount);
    accountRepository.save(toAccount);
}
```

* 在該方法中，使用最高的隔離級別，確保資金轉帳操作的絕對一致性，避免併發問題。

### **Isolation.DEFAULT**

#### **含義：**

* **默認隔離級別**：使用後端資料庫的默認隔離級別。

#### **特點：**

* 依賴於具體的資料庫實現，可能是 READ_COMMITTED 或 REPEATABLE_READ 等。

#### **使用場景：**

* 當不需要特別指定隔離級別時，使用資料庫的默認設置。

#### **範例：**

```java
@Transactional(isolation = Isolation.DEFAULT)
public void processOrder(Order order) {
    // 處理訂單
    orderRepository.save(order);
}
```
* 在該方法中，使用資料庫的默認隔離級別，適用於一般情況。