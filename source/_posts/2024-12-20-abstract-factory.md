---
title: 抽象工廠模式（Abstract Factory Pattern）
date: 2024-12-20 11:06:30
tags:
- [java]
- [design pattern]
category:
- [design pattern]
index_img: ../image/banner/java_index.jpg
banner_img: ../image/banner/abstract_factory_banner.png
---
{% note success %}
目錄
- **[design pattern 以java 為例](../../../../2024/03/30/design-pattern#創建型模式（Creational-Patterns）)**
{% endnote %}

## 什麼是抽象工廠
提供了一個用來創建一組相關或相互依賴對象的接口，而不需要指定具體的類。與工廠方法模式相比，抽象工廠模式不僅創建單一對象，還創建一組產品族（即多個相關的產品）。

### 主要特點：
- 產品族：抽象工廠模式是用來創建一組相關產品的工廠。每個具體工廠負責創建一組具體的產品。
- 解耦：抽象工廠模式能夠讓客戶端在不依賴具體類的情況下創建一組對象。

適用場景：當系統中有多個產品族，而客戶端需要根據具體情況創建不同的產品族時。

## 工廠 vs 抽象工廠

| 特徵                 | **工廠模式 (Factory Method)**                                 | **抽象工廠模式 (Abstract Factory)**                           |
|----------------------|------------------------------------------------------------|-------------------------------------------------------------|
| **目標**             | 創建單一產品                                               | 創建一組相關的產品                                           |
| **重點**             | 關注如何創建一個產品                                       | 關注如何創建一組互相關聯的產品                               |
| **產品數量**         | 只創建一個產品類型                                         | 同時創建多個相關的產品類型                                   |
| **擴展性**           | 易於擴展單一產品的類型                                     | 易於擴展產品族，添加新的產品族                               |
| **複雜性**           | 相對簡單，適用於需要創建單一產品的情況                     | 較複雜，適用於需要創建多個相關產品並且這些產品屬於同一族群的情況 |
| **客戶端**           | 客戶端使用具體工廠來創建單一產品                          | 客戶端使用抽象工廠來創建一組相關的產品                       |
| **適用場景**         | 當創建一個對象的過程需要封裝，且該對象是可擴展的           | 當系統中有多個產品族，且客戶端需要根據情況選擇創建一個產品族時 |
| **示例**             | 創建不同類型的單一產品（如不同的交通工具：車、船、飛機） | 創建一組相關產品（如不同系列的家具：桌子、椅子、沙發）       |


## 範例
家具有不同的功能，也有不同的風格

![](https://refactoring.guru/images/patterns/diagrams/abstract-factory/problem-en.png?id=e38c307511e684828be898de02d6c268)

### 重構前

多層次equal 判斷

```java
public class FurnitureService {

    public void createFurniture(String furnitureType, String style) {
        if ("chair".equalsIgnoreCase(furnitureType)) {
            if ("modern".equalsIgnoreCase(style)) {
                System.out.println("創建現代風格椅子，功能：坐");
            } else if ("classic".equalsIgnoreCase(style)) {
                System.out.println("創建古典風格椅子，功能：坐");
            } else if ("industrial".equalsIgnoreCase(style)) {
                System.out.println("創建工業風格椅子，功能：坐");
            } else {
                throw new RuntimeException("未知的椅子風格：" + style);
            }
        } else if ("sofa".equalsIgnoreCase(furnitureType)) {
            if ("modern".equalsIgnoreCase(style)) {
                System.out.println("創建現代風格沙發，功能：坐");
            } else if ("classic".equalsIgnoreCase(style)) {
                System.out.println("創建古典風格沙發，功能：躺");
            } else if ("industrial".equalsIgnoreCase(style)) {
                System.out.println("創建工業風格沙發，功能：坐");
            } else {
                throw new RuntimeException("未知的沙發風格：" + style);
            }
        } else if ("coffeetable".equalsIgnoreCase(furnitureType)) {
            if ("modern".equalsIgnoreCase(style)) {
                System.out.println("創建現代風格咖啡桌，功能：放置咖啡");
            } else if ("classic".equalsIgnoreCase(style)) {
                System.out.println("創建古典風格咖啡桌，功能：放置咖啡");
            } else if ("industrial".equalsIgnoreCase(style)) {
                System.out.println("創建工業風格咖啡桌，功能：放置咖啡");
            } else {
                throw new RuntimeException("未知的咖啡桌風格：" + style);
            }
        } else {
            throw new RuntimeException("未知的家具類型：" + furnitureType);
        }
    }
}

```

### 重構開始

![](https://refactoring.guru/images/patterns/diagrams/abstract-factory/solution2.png?id=53975d6e4714c6f942633a879f7ac571)

圖為 https://refactoring.guru/ 的示意圖，以下code有做變更

#### 定義包含返回訊息的enum

將功能放入enum，並定義家具的enum

```java
public enum FurnitureType {
    CHAIR("椅子", Collections.singletonList(FunctionalityType.SIT)),
    SOFA("沙發", Arrays.asList(FunctionalityType.SIT, FunctionalityType.LIE_DOWN)),
    COFFEE_TABLE("咖啡桌", Collections.singletonList(FunctionalityType.PLACE_COFFEE));
  
    private final String name;
    private final List<FunctionalityType> functionalities;
  
    FurnitureType(String name, List<FunctionalityType> functionalities) {
      this.name = name;
      this.functionalities = functionalities;
    }
  
    public String getName() {
      return name;
    }
  
    public List<FunctionalityType> getFunctionalities() {
      return functionalities;
    }
}

// filepath: /enums/StyleType.java
public enum StyleType {
    MODERN("現代"),
    CLASSIC("古典"),
    INDUSTRIAL("工業");

    private final String name;

    StyleType(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}

// filepath: /enums/FunctionalityType.java
public enum FunctionalityType {
    SIT("坐"),
    LIE_DOWN("躺"),
    PLACE_COFFEE("放置咖啡");

    private final String action;

    FunctionalityType(String action) {
        this.action = action;
    }

    public String getAction() {
        return action;
    }
}
```

#### 定義家具、風格和功能的接口

```java
public interface Furniture {
    void describe();
}

// filepath: /adapter/Style.java
public interface Style {
    String getStyleName();
}

// filepath: /adapter/Functionality.java
public interface Functionality {
    String getFunctionality();
}
```

#### 實現適配器，將家具、風格和功能組合：

由於功能與家具以做配對，使用適配器模式將風格和家具組合

```java
public class FurnitureAdapter implements Furniture {
    private Style style;
    private FurnitureType furnitureType;
  
    public FurnitureAdapter(FurnitureType furnitureType, Style style) {
      this.furnitureType = furnitureType;
      this.style = style;
    }

    @Override
    public void describe() {
        System.out.print("創建" + style.getStyleName() + "風格的" + furnitureType.getName() + "，功能：");
        List<FunctionalityType> functionalities = furnitureType.getFunctionalities();
        System.out.println(functionalities.stream()
                .map(FunctionalityType::getAction)
                .collect(Collectors.joining("、")));
    }
}
```

#### 實現風格

```java
public class ModernStyle implements Style {
    @Override
    public String getStyleName() {
        return StyleType.MODERN.getName();
    }
}

// filepath: /style/ClassicStyle.java
public class ClassicStyle implements Style {
    @Override
    public String getStyleName() {
        return StyleType.CLASSIC.getName();
    }
}

// filepath: /style/IndustrialStyle.java
public class IndustrialStyle implements Style {
    @Override
    public String getStyleName() {
        return StyleType.INDUSTRIAL.getName();
    }
}
```

#### 實現功能

```java
public class SitFunctionality implements Functionality {
    @Override
    public String getFunctionality() {
        return FunctionalityType.SIT.getAction();
    }
}

// filepath: /functionality/LieDownFunctionality.java
public class LieDownFunctionality implements Functionality {
    @Override
    public String getFunctionality() {
        return FunctionalityType.LIE_DOWN.getAction();
    }
}

// filepath: /functionality/PlaceCoffeeFunctionality.java
public class PlaceCoffeeFunctionality implements Functionality {
    @Override
    public String getFunctionality() {
        return FunctionalityType.PLACE_COFFEE.getAction();
    }
}
```

#### 定義抽象工廠

```java
public abstract class AbstractFurnitureFactory {

    protected abstract Style createStyle();

    //將原本分散的 createStyle() 方法統一放在 AbstractFurnitureFactory 類別中
    public Furniture createFurniture(FurnitureType furnitureType) {
        Style style = createStyle();
        return new FurnitureAdapter(furnitureType, style);
    }
}

```

#### 實現具體的工廠

```java

// filepath: /factory/ModernFurnitureFactory.java
public class ModernFurnitureFactory extends AbstractFurnitureFactory {
    @Override
    protected Style createStyle() {
        return new ModernStyle();
    }
}

// filepath: /factory/ClassicFurnitureFactory.java
public class ClassicFurnitureFactory extends AbstractFurnitureFactory {
    @Override
    protected Style createStyle() {
        return new ClassicStyle();
    }
}

// filepath: /factory/IndustrialFurnitureFactory.java
public class IndustrialFurnitureFactory extends AbstractFurnitureFactory {
    @Override
    protected Style createStyle() {
        return new IndustrialStyle();
    }
}

```

#### test：

```java
public class ApiTest {

    @Test
    public void testFurnitureAdapter() {
        Style style = new ModernStyle();
        FurnitureType furnitureType = FurnitureType.CHAIR;
        Furniture furniture = new FurnitureAdapter(furnitureType, style);
        furniture.describe();
    
        style = new ClassicStyle();
        furnitureType = FurnitureType.SOFA;
        furniture = new FurnitureAdapter(furnitureType, style);
        furniture.describe();
    
        style = new IndustrialStyle();
        furnitureType = FurnitureType.COFFEE_TABLE;
        furniture = new FurnitureAdapter(furnitureType, style);
        furniture.describe();
    }
}
```

```text
創建現代風格的椅子，功能：坐
創建古典風格的沙發，功能：躺
創建工業風格的咖啡桌，功能：放置咖啡
```

##
圖源/參考資料:

https://refactoring.guru/

[重學java設計模式-小博哥](https://bugstack.cn/md/product/book/design-pattern.html)
