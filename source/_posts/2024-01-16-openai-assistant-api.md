---
title: openai-assistant-api
date: 2024-01-16 16:45:46
tags:
- [python]
- [jupyter]
- [openai]
categories:
- [python]
- [openai]
index_img: ../image/banner/openai_index.jpg
banner_img: ../image/banner/openai_banner.png
---
# OpenAI Assistant
## 官方文檔
[https://platform.openai.com/docs/assistants/how-it-works](https://platform.openai.com/docs/assistants/how-it-works)

## 原理
![img.png](../image/openai_assistant.png)
將檔案及文件上傳openAI，建立一個客製化的助手，然後創立thread 供不同使用者可以同時使用該助手
```mermaid
graph TD;
    A[上傳檔案及文件] --> B[建立客製化的助手];
    B --> C[創立thread];
    C --> D[供不同使用者可以同時使用該助手];
```

