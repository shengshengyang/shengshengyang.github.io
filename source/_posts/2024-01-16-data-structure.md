---
title: 以 java 作為範例的 data structure 
date: 2024-01-16 22:47:14
tags:
- [data structure]
- [java]
categories:
- [data structure]
index_img: ../image/banner/java_index.jpg
banner_img: ../image/banner/java_banner_brown.jpg
---

# 資料結構

資料結構是計算機儲存、組織數據的方式。它使我們能夠有效地操作數據，包括其插入、刪除和搜索等操作。資料結構是為了解決兩類問題：數據儲存以及數據操作。

## 演算法

演算法是解決特定問題步驟的描述，在數據結構的基礎上設計和分析的。它是指令的集合，是為了解決特定問題而制定的一系列過程。演算法是無序的，意味著演算法的執行結果並不依賴於指令的順序。

## 兩者關係

資料結構與演算法兩者之間的關係密不可分，演算法要作用在特定的資料結構之上。因此，選擇或設計資料結構時，必須充分考慮其上的演算法。資料結構為某一特定應用的問題提供了組織數據的方式，而演算法則詳細指定了解決此問題的步驟。

## 常見類別

### 1. 陣列 (Array)
- [java array 的功能實作](../../../../2024/01/17/java-array)

### 2. 集合 (Collection)
- [java collection 介紹](../../../../2024/01/26/java-collection)
#### 列表 (List)

     - ArrayList
     - LinkedList

#### 集合 (Set)

     - HashSet
     - LinkedHashSet
     - TreeSet

#### 隊列 (Queue)

     - PriorityQueue
     - Deque
     - ArrayDeque
     - LinkedList

### 3. 映射 (Map)

    - HashMap
    - LinkedHashMap
    - TreeMap

### 4. 樹 (Tree)

    - Binary Tree
    - Binary Search Tree
    - AVL Tree
    - Red-Black Tree

### 5. 圖 (Graph)

    - Directed Graph
    - Undirected Graph
    - Weighted Graph

### 6. 堆疊 (Stack)

### 7. 鏈表 (Linked List)

    - Singly Linked List
    - Doubly Linked List
    - Circular Linked List

### 8. 哈希表 (Hash Table)

## 比較表

| 資料結構 | 子類別 | 範例 | 特點 |
| --- | --- | --- | --- |
| 陣列 (Array) | - | - | 固定大小，連續的記憶體空間 |
| 集合 (Collection) | 列表 (List) | ArrayList, LinkedList | 有序，可重複 |
|  | 集合 (Set) | HashSet, LinkedHashSet, TreeSet | 不重複，無序 |
|  | 隊列 (Queue) | PriorityQueue, Deque, ArrayDeque, LinkedList | 先進先出 (FIFO) |
| 映射 (Map) | - | HashMap, LinkedHashMap, TreeMap | 鍵值對，鍵不重複 |
| 樹 (Tree) | - | Binary Tree, Binary Search Tree, AVL Tree, Red-Black Tree | 階層結構，用於資料排序和搜索 |
| 圖 (Graph) | - | Directed Graph, Undirected Graph, Weighted Graph | 節點和邊的集合，用於表示物件間的關係 |
| 堆疊 (Stack) | - | - | 後進先出 (LIFO) |
| 鏈表 (Linked List) | - | Singly Linked List, Doubly Linked List, Circular Linked List | 元素連接，動態大小 |
| 哈希表 (Hash Table) | - | - | 鍵值對，使用哈希函數快速查找 |