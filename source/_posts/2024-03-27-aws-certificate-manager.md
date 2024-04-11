---
title: aws certificate manager 掛載tls憑證
date: 2024-03-27 22:39:20
tags:
- [aws]
- [http]
category:
- [aws]
index_img: ../image/banner/aws_index.jpeg
banner_img: ../image/banner/aws_banner.png
---
## https
> 安全版的http

主要是在客戶端及伺服器之間加入加密層，使用`TLS（Transport Layer Security）`或其前身`SSL（Secure Sockets Layer）`來加密通信

![aws-https.png](source/image/aws/aws-https.png)


## TLS 憑證
數字憑證，用於確認服務器的身份並為網站訪問者提供加密。它包含公鑰、憑證持有者的身份信息以及發行機構的數字簽名等

## AWS Certificate Manager {%label danger @免費使用 %}

有兩種方式可以掛載tls，一種是將key 包入docker 中在映射到 443 port，但在aws 中有更便利的方法就是AWS Certificate Manager（ACM）

![aws_tls.png](source/image/aws/aws_tls.png)

### 監聽程式
設定的部分會放在`ELB`的監聽裡,這樣就可以把ssl/tls憑證掛上去了，而且如果在同一台機器要expose不同port也可以直接做設定
![aws-listener.pn](source/image/aws/aws-listener.png)

詳細步驟可以參考: [https://www.metaage.com.tw/news/technology/476](https://www.metaage.com.tw/news/technology/476)