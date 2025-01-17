---
title: 工廠模式（Factory Pattern）
date: 2024-12-20 09:18:19
tags:
- [java]
- [design pattern]
category:
- [design pattern]
index_img: ../image/banner/java_index.jpg
banner_img: ../image/banner/factory_banner.png
---
{% note success %}
目錄
- **[design pattern 以java 為例](../../../../2024/03/30/design-pattern#創建型模式（Creational-Patterns）)**
{% endnote %}

## 什麼是工廠模式?
用於隱藏對象創建的具體實現細節，讓程式設計可以專注於使用物件，而不需要知道物件是如何被創建的。這種模式的主要目的是透過「工廠」來管理物件的創建，提升程式的可擴展性與可維護性。

## 重構前
所有的邏輯都可以靠if-else 解決，如果不行就再加一層(?)

```java
public class LogisticsService {

    public void deliverPackage(String logisticsType, String packageId, String destination) {
        if ("express".equalsIgnoreCase(logisticsType)) {
            System.out.println("使用快遞物流運送，包裹編號：" + packageId + "，目的地：" + destination);
        } else if ("freight".equalsIgnoreCase(logisticsType)) {
            System.out.println("使用貨運物流運送，包裹編號：" + packageId + "，目的地：" + destination);
        } else if ("drone".equalsIgnoreCase(logisticsType)) {
            System.out.println("使用無人機物流運送，包裹編號：" + packageId + "，目的地：" + destination);
        } else {
            throw new RuntimeException("未知的物流類型：" + logisticsType);
        }
    }
}

```
## 重構後

### 定義接口

```java
public interface Logistics {
    void deliver(String packageId, String destination);
}
```

### 實現接口

- 貨運
    ```java
    public class FreightLogistics implements Logistics {
        @Override
        public void deliver(String packageId, String destination) {
            System.out.println("使用貨運物流運送，包裹編號：" + packageId + "，目的地：" + destination);
        }
    }
    ```
- 快遞
    ```java
    public class ExpressLogistics implements Logistics {
        @Override
        public void deliver(String packageId, String destination) {
            System.out.println("使用快遞物流運送，包裹編號：" + packageId + "，目的地：" + destination);
        }
    }
    
    ```
- 無人機
```java
public class DroneLogistics implements Logistics {
    @Override
    public void deliver(String packageId, String destination) {
        System.out.println("使用無人機物流運送，包裹編號：" + packageId + "，目的地：" + destination);
    }
}
```
### 建立 Enum

```java
public enum LogisticsEnum {
    EXPRESS("express", new ExpressLogistics()),
    FREIGHT("freight", new FreightLogistics()),
    DRONE("drone", new DroneLogistics());

    private final String type;
    private final Logistics logisticsService;

    LogisticsEnum(String type, Logistics logisticsService) {
        this.type = type;
        this.logisticsService = logisticsService;
    }

    public String getType() {
        return type;
    }

    public Logistics getLogisticsService() {
        return logisticsService;
    }

    public static Logistics getLogisticsByType(String logisticsType) {
        for (LogisticsEnum value : values()) {
            if (value.getType().equalsIgnoreCase(logisticsType)) {
                return value.getLogisticsService();
            }
        }
        throw new IllegalArgumentException("未知的物流類型：" + logisticsType);
    }
}
```

### 建立工廠
```java
public class LogisticsFactory {

    /**
     * 根據物流類型返回對應的物流服務
     *
     * @param logisticsType 物流類型
     * @return Logistics 對應的物流服務實例
     */
    public static Logistics getLogisticsService(String logisticsType) {
        return Arrays.stream(LogisticsEnum.values())
                .filter(enumType -> enumType.getType().equalsIgnoreCase(logisticsType))
                .findFirst()
                .map(LogisticsEnum::getLogisticsService)
                .orElseThrow(() -> new IllegalArgumentException("未知的物流類型：" + logisticsType));
    }
}
```

### 未來擴建

- Enum 內新增
    ```text
    SEA("sea", new SeaLogistics())
    ```
- 建立實例
    ```java
    
    public class SeaLogistics implements Logistics {
    
        @Override
        public void deliver(String packageId, String destination) {
            System.out.println("使用海運物流運送，包裹編號：" + packageId + "，目的地：" + destination);
        }
    }
    ```

## 結論

這種方式保證了程式碼結構的清晰和擴展的便捷性，完全符合[開放/封閉原則 (OCP)](../../../../2024/03/30/ocp)。

##
圖源/參考資料: 

https://refactoring.guru/

[重學java設計模式-小博哥](https://bugstack.cn/md/product/book/design-pattern.html)
