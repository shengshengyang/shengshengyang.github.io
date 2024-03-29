---
title: design pattern 以java 為例
date: 2024-03-30 00:05:26
tags:
- [java]
- [design pattern]
category:
- [design pattern]
index_img: ../image/banner/java_index.jpg
banner_img: ../image/banner/design-pattern-banner.gif
---
# Design pattern

軟體工程中一種對於常見問題的解決方案的標準化描述，簡單講就是人家想好的高效範本

## 分類

### 創建型模式（Creational Patterns）
創建對象時隱藏創建邏輯的方式，而不是使用new關鍵字直接實例化對象。

- Singleton（單例模式）
- Factory Method（工廠方法模式）
- Abstract Factory（抽象工廠模式）
- Builder（建造者模式）
- Prototype（原型模式）

### 結構型模式（Structural Patterns）
關注類和對象的組織，如何將類或對象組合成更大的結構。它們幫助確保系統的一部分更改不會影響到系統的其他部分，從而使系統更容易開發和維護。

- Adapter（適配器模式）
- Composite（組合模式）
- Proxy（代理模式）
- Facade（外觀模式）
- Bridge（橋接模式）
- Decorator（裝飾模式）

### 行為型模式（Behavioral Patterns）
對象間的通信，為對象間的通信提供更靈活的方式
- Observer（觀察者模式）
- Strategy（策略模式）
- Command（命令模式）
- State（狀態模式）
- Visitor（訪問者模式）
- Mediator（中介者模式）
- Iterator（迭代器模式）


### 推薦課程
[https://www.udemy.com/course/design-patterns-java/](https://www.udemy.com/course/design-patterns-java/)

接下來會以課程範例危機底去延伸每個pattern 的應用及實際code