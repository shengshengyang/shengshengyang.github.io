---
title: mysql 保留字
date: 2024-03-11 21:35:28
tags:
- [sql]
- [mysql]
category:
- [sql]
index_img: ../image/banner/sql_index.webp
banner_img: ../image/banner/sql_banner.png
---
# 保留字

SQL保留字是在SQL語言中具有特殊意義的字詞。這些字詞包括`SELECT`、`INSERT`、`UPDATE`、`DELETE`、`FROM`、`WHERE`等等。在撰寫SQL查詢時，不能將這些保留字用作表名或列名。

## 方言

`USER`和`PERMISSION`是許多SQL方言中的保留字。如果你嘗試使用Hibernate來創建名為USER或PERMISSION的表，可能會遇到問題，因為Hibernate會生成使用這些保留字的SQL查詢，這可能會導致語法錯誤。
前陣子在寫spring security 創建範例資料庫時直接使用了user，導致會不斷出現

{% note danger %}
can not find table security.user
{% endnote %}

## 解法
### 避開
一般只要避開即可 ，如用 `users` 或 `permissions`

### @Table
一定要用的話(建議是不要堅持拉)，可以使用<span class="label label-danger">@table</span>

```java
@Entity
@Table(name = "`user`")
public class User {
    // ...
}
```

希望以後不要再卡這種坑了..