---
title: java polymorphism
date: 2024-01-31 00:36:11
tags:
- [java]
category:
- [java]
index_img: ../image/banner/java_index.jpg
banner_img: ../image/banner/java_banner_brown.jpg
---

# polymorphism 多形

## 定義

多態性是物件導向程式設計的核心概念之一，它指的是一個對象（尤其是方法或對象）可以有多種形式（多個類型）。在 Java 中，多態性主要分為兩種：

### 編譯時多態性 (Compile-time Polymorphism)：

這主要是通過方法重載（Method Overloading）實現的。

#### 方法重載 (Method Overloading)

- 概念：在同一個類中定義多個方法名相同但參數列表不同的方法。
- 目的：增加程式的可讀性和可重用性。
- 範例
    ```java
    public class DemoClass {
       public int add(int a, int b) {
            return a + b;
       }
    
        public double add(double a, double b) {
            return a + b;
        }
    }
    ```

### 運行時多態性 (Runtime Polymorphism)

這主要是通過方法重寫（Method Overriding）和向上轉型（Upcasting）實現的。

#### 方法重寫 (Method Overriding)

- 概念：子類提供與父類中某個方法相同的方法名、參數列表和返回類型的方法。
- 目的：實現運行時多態性，允許子類定義特定的行為。
- 範例
    ```java
    class Animal {
      public void sound() {
         System.out.println("動物發出聲音");
      }
    }

    class Dog extends Animal {
      @Override
      public void sound() {
        System.out.println("狗吠");
      }
    }
    ```
 
#### 向上轉型 (Upcasting)

- 概念：將子類型的引用賦值給父類型的引用。

- 目的：實現接口的一致性，能夠使用通用的接口來引用不同的子類實例。

- 範例
    ```java
   Animal myDog = new Dog();
   myDog.sound();  // 輸出：狗吠
    ```
  
