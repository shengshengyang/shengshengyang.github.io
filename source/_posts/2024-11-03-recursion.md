---
title: recursion
date: 2024-11-03 17:03:09
tags:
- [java]
- [data structure]
categories:
- [java]
- [data structure]

index_img: ../image/banner/java_index.jpg
banner_img: ../image/banner/java_banner_brown.jpg
---

# Recursion

## What is Recursion?

包含兩個部分

### 1. Base Case: 終止條件

A base case (or cases) defined, which defines when the recursion is stopped - otherwise it will go on {% label danger @forever! %}

### 2. Recursive Case: 遞迴條件

A recursive case, which calls the function itself with a modified input, moving it closer to the base case.

### Example

```java
public class Recursion {
    public static void main(String[] args) {
        System.out.println(factorial(5));
    }

    public static int factorial(int n) {
        if (n == 0) {
            return 1;
        }
        return n * factorial(n - 1);
    }
}
```
