---
title: transactional-propagation
date: 2024-11-11 11:54:53
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
# propagation
在 Spring 的 @Transactional 註解中，propagation 屬性控制著事務的傳播行為，決定了當一個方法在事務上下文中被調用時該如何處理事務。

## Propagation.REQUIRED
### **含義：**

* **共享當前事務**：如果當前存在事務，方法將在該事務中執行。

* **新建事務**：如果當前沒有事務，將創建一個新的事務。

### **使用場景：**

適用於大多數情況，確保方法在事務中執行，維護資料一致性。

### **範例：**

```java
@Service
public class OrderService {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private PaymentService paymentService;

    @Transactional(propagation = Propagation.REQUIRED)
    public void placeOrder(Order order) {
        // 扣減庫存
        inventoryService.reduceStock(order.getProductId(), order.getQuantity());
        // 處理付款
        paymentService.processPayment(order.getPaymentInfo());
        // 保存訂單
        orderRepository.save(order);
    }
}
```
placeOrder 方法需要確保所有操作在同一事務中執行，避免部分操作成功、部分失敗的情況。

## Propagation.REQUIRES_NEW

### **含義：**

* **總是新建事務**：方法將始終在一個新的事務中執行。

* **暫停當前事務**：如果存在當前事務，將其暫停直到新事務完成。

### **使用場景：**

需要方法在獨立的事務中執行，與外部事務隔離。

### **範例：**

```
@Service
public class AuditService {

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAudit(AuditRecord record) {
        // 保存審計記錄
        auditRepository.save(record);
    }
}

@Service
public class UserService {

    @Autowired
    private AuditService auditService;

    @Transactional(propagation = Propagation.REQUIRED)
    public void updateUser(User user) {
        // 更新用戶信息
        userRepository.save(user);
        // 記錄審計信息
        auditService.logAudit(new AuditRecord("User updated", user.getId()));
    }
}
```

`logAudit` 方法在一個新事務中執行，確保審計記錄總是被保存，即使 `updateUser` 方法的事務回滾。

## Propagation.SUPPORTS

### **含義：**

* **支持當前事務**：如果存在事務，方法就在該事務中執行。

* **非事務執行**：如果沒有事務，方法以非事務方式執行。

### **使用場景：**

方法不需要強制事務支持，可有可無。

### **範例：**

```
@Service
public class ProductService {

    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Product getProductById(Long id) {
        // 查詢產品
        return productRepository.findById(id).orElse(null);
    }
}
```
`getProductById` 方法主要執行查詢操作，在有事務時參與事務，無事務時以非事務方式執行。

## Propagation.NOT_SUPPORTED

### **含義：**

* **非事務執行**：方法總是在非事務環境中執行。

* **掛起當前事務**：如果存在事務，將其掛起直到方法執行完畢。

### **使用場景：**

避免方法在事務中執行，防止長時間運行導致事務佔用資源。

### **範例：**

```
@Service
public class ReportService {

    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public void generateReport() {
        // 生成報表的耗時操作
        reportGenerator.generate();
    }
}
```
* `generateReport` 方法執行時間較長，不需要事務支持，避免長時間佔用事務資源。


## Propagation.NESTED

### **含義：**

* **嵌套事務**：方法在嵌套的事務中執行。

* **保存點回滾**：內部事務失敗時，只回滾內部事務，不影響外部事務。

### **使用場景：**

需要在一個大事務中，對某部分操作單獨回滾，而不影響整體事務。

### **範例：**

```
@Service
public class PaymentService {

    @Transactional(propagation = Propagation.NESTED)
    public void processPayment(Payment payment) {
        // 處理付款
        paymentRepository.save(payment);
        // 模擬異常
        if (payment.getAmount() > 1000) {
            throw new RuntimeException("付款金額過大");
        }
    }
}

@Service
public class OrderService {

    @Autowired
    private PaymentService paymentService;

    @Transactional(propagation = Propagation.REQUIRED)
    public void placeOrder(Order order) {
        // 保存訂單
        orderRepository.save(order);
        try {
            // 處理付款
            paymentService.processPayment(order.getPayment());
        } catch (Exception e) {
            // 處理付款失敗，不影響訂單保存
            System.out.println("付款失敗：" + e.getMessage());
        }
    }
}
```
* `processPayment` 方法在嵌套事務中執行，當付款失敗時，只回滾付款操作，`placeOrder` 方法的事務繼續進行。

* 這樣可以在不影響主要事務的情況下，單獨回滾某些操作。

## Propagation.MANDATORY

### **含義：**

* **必須存在事務**：方法必須在事務中執行。

* **拋出異常**：如果當前沒有事務，將拋出異常。

### **使用場景：**

方法需要在事務上下文中執行，否則無法保證資料一致性。

### **範例：**

```
@Service
public class NotificationService {

    @Transactional(propagation = Propagation.MANDATORY)
    public void sendNotification(Notification notification) {
        // 發送通知
        notificationRepository.save(notification);
    }
}

@Service
public class OrderService {

    @Autowired
    private NotificationService notificationService;

    @Transactional(propagation = Propagation.REQUIRED)
    public void completeOrder(Order order) {
        // 完成訂單
        orderRepository.save(order);
        // 發送通知
        notificationService.sendNotification(new Notification("Order completed", order.getUserId()));
    }
}
```
* `sendNotification` 方法必須在事務中執行，確保通知的資料一致性。

* 如果單獨調用 `sendNotification`，且沒有事務存在，將拋出異常。

## Propagation.NEVER
### **含義：**

* **禁止事務執行**：方法必須在非事務環境中執行。

* **拋出異常**：如果當前存在事務，將拋出異常。

### **使用場景：**

嚴格要求方法不能在事務中執行。

### **範例：**

```
@Service
public class CacheService {

    @Transactional(propagation = Propagation.NEVER)
    public void refreshCache() {
        // 刷新快取
        cacheManager.refreshAll();
    }
}
```
* `refreshCache` 方法不應該在事務中執行，以免影響快取一致性。

## Propagation.REQUIRED V.S. Propagation.MANDATORY

* **事務存在性要求**：

    * **Propagation.REQUIRED**：**有則加入，無則創建**。方法不關心當前是否有事務存在，總能在事務中執行。

    * **Propagation.MANDATORY**：**有則加入，無則報錯**。方法**要求**當前必須有事務，否則拋出異常。

* **新建事務的能力**：

    * **Propagation.REQUIRED**：能夠創建新事務。

    * **Propagation.MANDATORY**：**不能**創建新事務，僅能在現有事務中執行。

### **Propagation.REQUIRED**

#### **適用情況**：

* 大多數需要事務支持的方法。

* 方法希望在有事務時參與事務，沒有事務時自行創建事務。


#### **範例**：

```
  @Transactional(propagation = Propagation.REQUIRED)
  public void updateAccount(Account account) {
      // 更新帳戶資料
      accountRepository.save(account);
  }
  ```
  * 無論調用 `updateAccount` 方法時是否存在事務，該方法都能保證在事務中執行。

### **Propagation.MANDATORY**

####  **適用情況**：

* 方法必須在事務上下文中執行，且不允許自行創建事務。

* 常用於需要由外部事務控制的方法，強制要求在特定的事務流程中執行。


####  **範例**：

```
  @Transactional(propagation = Propagation.MANDATORY)
  public void validateTransaction(Transaction tx) {
      // 驗證交易
      if (!isValid(tx)) {
          throw new InvalidTransactionException();
      }
  }
  ```
* `validateTransaction` 方法只能在已有事務中被調用，否則將拋出異常。

* 這樣可以確保方法執行時，一定處於一個完整的事務流程中。