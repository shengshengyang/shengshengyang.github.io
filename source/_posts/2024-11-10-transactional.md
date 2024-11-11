---
title: transactional
date: 2024-11-10 17:01:22
tags:
- [backend]
- [java]
- [spring]
categories:
- [java]
index_img: ../image/banner/java_index.jpg
banner_img: ../image/banner/java_banner_brown.jpg
---
# @Transactional

@Transactional 是 Spring 框架中的一個註解，用於管理方法或類的事務行為。它允許開發者定義事務的邊界，確保在方法執行過程中，數據庫操作遵循 ACID 原則，以維護數據的一致性和完整性。

## 配置
<p class="note note-primary">Spring 要配置@EnableTransactionManagement, SpringBoot 不用</p>

因為SpringBoot 有自動配置的機制，如果使用了`starter-jdbc` 等依賴的狀況下，會自動添加`@EnableTransactionManagement` 註解，所以不需要再額外配置。

```java
@Configuration
@EnableTransactionManagement
public class AppConfig {

    @Bean
    public PlatformTransactionManager transactionManager() {
        return new DataSourceTransactionManager(dataSource());
    }
}
```
或是xml
```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans 
                           http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/tx 
                           http://www.springframework.org/schema/tx/spring-tx.xsd">

    <!-- 配置數據源和事務管理器 -->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"/>
    </bean>

    <!-- 啟用註解驅動事務管理 -->
    <tx: annotation-driven transaction-manager="transactionManager"/>
```

## 使用

以下是 Transactional interface 可以作用在 method 及  class 上
```java
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
public @interface Transactional {
  ......
}
```

### 作用在方法上
- 作用在method  上時，只能使用 public 方法
```java
@Service
public class UserService {

    @Autowired
    private UserDao userDao;

    @Transactional
    public void save(User user) {
        userDao.save(user);
    }
}
```
- method 裡面如果有 catch exception , 不會 rollback
```java
@Transactional(rollbackFor = Exception.class)
public void save(User user) {
    try {
        userDao.save(user);
        throw new RuntimeException("Exception");
    } catch (Exception e) {
        // 這裡不會rollback
    }
}
```

### 作用在class上
- 所有 public 方法都會套用
```java
@Transactional
@Service
public class UserService {

    @Autowired
    private UserDao userDao;

    public void save(User user) {
        userDao.save(user);
    }
}
```

- class 的內部調用不會被事務管理
```java
@Service
public class ExampleService {

    @Transactional
    public void performOperation() {
        // 實際業務邏輯
        System.out.println("執行業務操作...");
        // 內部調用另一個帶有 @Transactional 的方法
        updateRecord();
    }

    @Transactional
    public void updateRecord() {
        // 更新操作邏輯
        System.out.println("更新記錄...");
    }
}

```
#### 問題
- 問題原因：當 performOperation 調用 updateRecord 時，由於這是內部方法調用，Spring AOP 的事務代理無法攔截，導致 updateRecord 中的 @Transactional 註解被忽略。因此，updateRecord 不會啟動新事務或加入當前事務，可能出現事務失效的情況。
- 解決方案：將 updateRecord 方法移到另一個服務class中，以便通過代理進行調用，或者使用 Spring 的 CGLIB 代理模式
```java
@Service
public class RecordService {

    @Transactional
    public void updateRecord() {
        System.out.println("更新記錄...");
    }
}

@Service
public class ExampleService {

    private final RecordService recordService;

    public ExampleService(RecordService recordService) {
        this.recordService = recordService;
    }

    @Transactional
    public void performOperation() {
        System.out.println("執行業務操作...");
        // 透過代理方式調用 updateRecord
        recordService.updateRecord();
    }
}

```

## 與 AOP 的共存與衝突
在大部分情況下，@Transactional 和自定義的 AOP 切面可以正常共存。以下範例展示了兩者的共用，方法在執行時，先執行自定義的 AOP 切面邏輯，然後啟動事務。
```java
// 日誌切面
@Aspect
@Component
public class LoggingAspect {

    @Before("execution(* com.example.service.*.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        System.out.println("執行方法: " + joinPoint.getSignature().getName());
    }
}

// 服務類別
@Service
public class ExampleService {

    @Transactional
    public void performOperation() {
        // 實際業務邏輯
        System.out.println("執行業務操作...");
    }
}
```
### 切面順序
有時，使用 @Transactional 和自定義的 AOP 切面時，切面執行順序可能會導致預期外的行為。
```java
@Aspect
@Component
public class PostTransactionLoggingAspect {

    @AfterReturning("execution(* com.example.service.*.*(..))")
    public void logAfter(JoinPoint joinPoint) {
        System.out.println("操作已完成：" + joinPoint.getSignature().getName());
    }
}

@Service
public class ExampleService {

    @Transactional
    public void performOperation() {
        System.out.println("執行業務操作...");
    }
}

```
#### 問題
- 問題原因：logAfter 方法在業務方法執行結束後立即執行，但此時事務尚未提交，logAfter 無法確保操作已被提交到資料庫中。
- 解決方案：可以將 @AfterReturning 換成 @AfterTransaction 這樣的機制（需使用 TransactionSynchronizationManager 或定義 Spring 事務同步回調）。
```java
@Service
public class ExampleService {

    @Transactional
    public void performOperation() {
        System.out.println("執行業務操作...");
        
        // 事務完成後的操作
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronizationAdapter() {
            @Override
            public void afterCommit() {
                System.out.println("事務提交後執行操作日誌...");
            }
        });
    }
}
```

也可以通過實現 Ordered 接口或使用 @Order 註解來設置切面的執行順序。

```java
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Order(100) // 設置較高的順序，使其在事務切面之後執行
public class PostTransactionLoggingAspect {

    @AfterReturning("execution(* com.example.service.*.*(..))")
    public void logAfter(JoinPoint joinPoint) {
        System.out.println("操作已完成：" + joinPoint.getSignature().getName());
    }
}
```

## Propagation 

- [Propagation 的功能實作](../../../../2024/11/11/transactional-propagation)
| 傳播行為           | 含義                                                                                     | 執行條件                                | 使用場景                                       | 不使用的影響                                             |
|--------------------|------------------------------------------------------------------------------------------|-----------------------------------------|------------------------------------------------|----------------------------------------------------------|
| **REQUIRED**       | 共享當前事務，無事務則新建                                                               | 有事務則加入，無事務則創建新事務         | 資料一致性高的關鍵操作，如更新、刪除、插入操作  | 失去與外部事務的一致性，可能導致數據不一致               |
| **REQUIRES_NEW**   | 總是創建新事務，掛起當前事務                                                             | 總是創建新事務，不受外部事務影響         | 不可撤銷操作，獨立性高的操作，如支付記錄        | 操作將隨外部事務回滾，無法保證操作的不可撤銷性           |
| **SUPPORTS**       | 有事務則參與，無事務則非事務執行                                                         | 根據外部事務環境執行                     | 輔助性操作、只讀查詢等無事務依賴的操作          | 可能創建不必要的事務，造成性能開銷                       |
| **NOT_SUPPORTED**  | 總是在非事務環境中執行，若有事務則掛起                                                   | 無事務環境執行                           | 長時間操作，如批量報表生成、數據導出            | 操作會在事務中執行，可能造成鎖定資源、性能下降           |
| **NEVER**          | 必須在無事務環境執行，若有事務則拋出異常                                                 | 嚴格無事務環境                           | 必須避免事務影響的操作，如快取查詢、外部 API 調用 | 若在事務內執行，操作可能受事務回滾影響，造成錯誤數據恢復 |
| **MANDATORY**      | 必須在事務中執行，若無事務則拋出異常                                                     | 嚴格在事務中執行                         | 強一致性操作，需要確保在事務中的關鍵操作         | 若無事務執行，操作將失去一致性保證，導致數據不一致       |
| **NESTED**         | 在嵌套事務中執行，失敗時回滾至保存點而不影響外部事務                                     | 創建嵌套事務，外部事務失敗可回滾至保存點 | 多步驟操作，允許部分回滾的情境                  | 操作無法在保存點回滾，外部事務失敗會回滾整個事務         |

## Isolation
| 隔離級別           | 含義                                                                                     | 執行條件                                | 使用場景                                       | 不使用的影響                                             |
|--------------------|------------------------------------------------------------------------------------------|-----------------------------------------|------------------------------------------------|----------------------------------------------------------|
| **DEFAULT**        | 使用數據庫默認隔離級別，通常是 READ_COMMITTED                                           | 數據庫默認隔離級別                       | 一般操作，不需要特定隔離級別                     | 隔離級別不明確，可能導致數據不一致                         |
| **READ_UNCOMMITTED** | 允許讀取未提交的數據，可能導致髒讀、不可重複讀、幻讀                                 | 事務允許讀取未提交的數據                 | 對數據一致性要求不高的操作，如報表生成、數據導出 | 可能導致髒讀、不可重複讀、幻讀等問題                      |
| **READ_COMMITTED** | 只能讀取已提交的數據，避免髒讀，但可能導致不可重複讀、幻讀                         | 事務只能讀取已提交的數據                 | 一般操作，對數據一致性要求較高的操作             | 可能導致不可重複讀、幻讀等問題                            |
| **REPEATABLE_READ** | 可重複讀，避免不可重複讀，但可能導致幻讀                                               | 事務可重複讀                           | 需要保證數據一致性，如庫存管理、訂單管理         | 可能導致幻讀等問題                                       |
| **SERIALIZABLE**   | 串行化，避免幻讀、不可重複讀，但性能較差                                                | 事務串行化執行                           | 需要最高隔離級別，如資金交易、庫存管理           | 性能較差，可能導致死鎖、性能下降等問題                    |
