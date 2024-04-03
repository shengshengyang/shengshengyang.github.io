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

### SOLID原則

SOLID原則是面向對象設計和程式開發中的一組五個基本原則，旨在促進軟體的可讀性、可維護性和擴展性

- [單一職責原則（Single Responsibility Principle, SRP）](../../../../2024/03/31/srp)
   每個類應該只有一個引起它變化的原因。這個原則強調，一個類應該專注於單一的職責或功能。當一個類承擔過多的職責時，它在面對修改的需求時將變得脆弱和不靈活。

- [開放封閉原則 (OCP: Open Closed Principle)](../../../../2024/03/30/ocp)
   軟體實體（類、模塊、函數等）應該對擴展開放，對修改封閉。這意味著一個實體允許其行為以擴展的形式被增加，但是不應該修改現有的代碼。


- 里氏替換原則（Liskov Substitution Principle, LSP）
   子類別應該能夠替換它們的基類別（父類別）而不影響程式的正確性。這個原則強調繼承的正確性，子類應當能夠完整地實現父類的行為。


- [介面隔離原則（Interface Segregation Principle, ISP)](../../../../2024/04/01/isp)
   不應該強迫客戶依賴於他們不使用的接口。這個原則鼓勵創建細分的接口，讓實現類只需要關心它們真正需要的方法，減少不必要的依賴。


- [依賴倒置原則（Dependency Inversion Principle, DIP）](../../../../2024/04/03/dip)
   高層模塊不應該依賴於低層模塊，它們都應該依賴於抽象；抽象不應該依賴於細節，細節應該依賴於抽象。這個原則鼓勵依賴於抽象類或接口，而不是具體類，從而降低系統各部分之間的耦合度。


### 創建型模式（Creational Patterns）
創建對象時隱藏創建邏輯的方式，而不是使用new關鍵字直接實例化對象。

- Singleton（單例模式）
- Factory Method（工廠方法模式）
- Abstract Factory（抽象工廠模式）
- [Builder（建造者模式）](../../../../2024/04/03/builder)
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

### SOLID


### 推薦課程
[https://www.udemy.com/course/design-patterns-java/](https://www.udemy.com/course/design-patterns-java/)

接下來會以課程範例危機底去延伸每個pattern 的應用及實際code