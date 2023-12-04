---
title: jdbc連線記得關
date: 2023-12-04 15:52:20
tags:
- [backend]
- [java]
- [jdbc]
categories:
- [java]
---
今天在開心測試的途中發現程式會停在奇怪的地方，停的地方也不是由我變更的，後來不斷往前追才發現是我新加的jdbc conn 忘記關了，造成下一個要call 的時候連線數占用，最常見的流程應該如下

### JDBC conn 
- #### 建立連線
- #### try-with-resources
- #### finally 關閉連線
```java
Connection connection = null;
try {
    connection = DriverManager.getConnection(url, username, password);
    // 在此處處理資料庫操作
} catch (SQLException e) {
    // 處理異常情況
} finally {
    if (connection != null) {
        try {
            connection.close();
        } catch (SQLException e) {
            // 處理關閉連線時的異常情況
        }
    }
}

```
### 結語
在Java應用程式中，正確地管理資源是至關重要的。尤其是在使用JDBC連線這樣的資源時，避免忘記關閉連線是確保應用程式順利運行的關鍵。透過使用try-with-resources語句或手動關閉連線，我們可以有效地解決這個常見的問題，確保資源得到適當的釋放，提高應用程式的效能和穩定性。