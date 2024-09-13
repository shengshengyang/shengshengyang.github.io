---
title: 爬蟲新聞資料後總結重點每日匯報-ai總結篇
date: 2024-09-13 16:54:59
tags:
- [python]
- [crawler]
- [openai]
category:
- [python]
- [ai]
index_img: ../image/banner/crawler_index.png
banner_img: ../image/banner/crawler_banner.png
---
延續上篇，來講重點總結的部分，主要透過openai api 來做總結

### tiktoken

[https://github.com/openai/tiktoken](https://github.com/openai/tiktoken)
主要是用來計算送出的字數，由於爬來的新聞量大，有時有可能會超過單次api 可送出的token 數

```python
import tiktoken

# 定義一個函數來計算輸入文字的 token 數量
# 參數:
#   - text: 需要計算 token 的文字
#   - model: 模型的名稱，預設為 "gpt-4"，可根據需要調整模型類型
def count_tokens(text, model="gpt-4"):
    # 根據指定的模型獲取相應的編碼方式
    encoding = tiktoken.encoding_for_model(model)
    
    # 將文字進行編碼並返回編碼後 token 的數量
    return len(encoding.encode(text))
```

### python openai

計算完token數後就可以來送api總結，詳細用法可以看
[https://github.com/openai/openai-python](https://github.com/openai/openai-python)

```python
# 定義一個函數，用來對給定的新聞內容進行摘要與股市走勢預測
# 參數:
#   - content: 要進行統整與預測的新聞內容
def summarize_content(content):
    print('Summarizing content...')
    
    # 調用 OpenAI 的 API 來生成新聞的摘要和股市預測
    response = openai.chat.completions.create(
        model="gpt-4o-2024-08-06",  # 指定使用 GPT-4o 模型
        messages=[
            {
                # 定義系統角色，設置 AI 的行為
                "role": "system",
                "content": "你是一位金融市場專家，擅長根據新聞資料進行分析並預測股市走勢。"  # 系統消息，設置 AI 的身份和專業領域
            },
            {
                # 定義用戶的輸入消息
                "role": "user",
                "content": f"請閱讀以下新聞摘要，根據相似的內容進行統整，並針對相似的內容給予股價預測可能走勢，最後分組回答：\n\n{content}"  # 用戶消息，請求 AI 根據新聞進行總結和預測
            }
        ]
    )
    
    # 從 API 回應中提取 AI 生成的摘要和預測文本
    # response.choices[0].message.content: 取得第一個生成的回應內容
    summary_text = response.choices[0].message.content.strip()  
    
    return summary_text

```

### 完整code
```python
import openai
import mysql.connector
from mysql.connector import Error
from datetime import datetime, timedelta
import tiktoken
import argparse
from dotenv import load_dotenv
import os



# 載入 .env 文件
load_dotenv()
# 從 .env 文件中讀取 API 金鑰
openai.api_key = os.getenv('OPENAI_API_KEY')

print(openai.api_key)

# 設置 GPT-4 的最大 token 限制
MAX_TOKENS = 30000
BATCH_TOKEN_LIMIT = 10000


# 連接 MySQL 資料庫
def create_connection():
    connection = None
    try:
        connection = mysql.connector.connect(
            host=os.getenv('MYSQL_HOST'),
            database=os.getenv('MYSQL_DATABASE'),
            user=os.getenv('MYSQL_USER'),
            password=os.getenv('MYSQL_PASSWORD')
        )
    except Error as e:
        print(f"Error: {e}")
    return connection


# 取得指定日期的新聞摘要資料
def get_news_by_date(connection, target_date):
    query = "SELECT id, title, content FROM news WHERE date = %s"
    cursor = connection.cursor(dictionary=True)
    cursor.execute(query, (target_date,))
    news_list = cursor.fetchall()
    cursor.close()
    return news_list


# 計算文本的 token 數量
def count_tokens(text, model="gpt-4"):
    encoding = tiktoken.encoding_for_model(model)
    return len(encoding.encode(text))


# 使用 GPT-4 進行摘要
def summarize_content(content):
    print('Summarizing content...')
    response = openai.chat.completions.create(
        model="gpt-4o-2024-08-06",
        messages=[
            {
                "role": "system",
                "content": "你是一位金融市場專家，擅長根據新聞資料進行分析並預測股市走勢。"
            },
            {
                "role": "user",
                "content": f"請閱讀以下新聞摘要，根據相似的內容進行統整，並針對相似的內容給予股價預測可能走勢，最後分組回答：\n\n{content}"
            }
        ]
    )

    summary_text = response.choices[0].message.content.strip()
    return summary_text


# 將文本分成多個不超過 BATCH_TOKEN_LIMIT 的段落進行摘要
def summarize_in_batches(news_content):
    tokens = count_tokens(news_content)
    if tokens <= BATCH_TOKEN_LIMIT:
        return summarize_content(news_content)

    # 將文本按 token 限制進行分段
    paragraphs = news_content.split('\n\n')
    batch = []
    batch_token_count = 0
    batch_summaries = []

    for paragraph in paragraphs:
        paragraph_tokens = count_tokens(paragraph)

        if batch_token_count + paragraph_tokens > BATCH_TOKEN_LIMIT:
            # 當一批超過 token 限制時，先對該批進行摘要
            batch_summaries.append(summarize_content("\n\n".join(batch)))
            batch = []
            batch_token_count = 0

        batch.append(paragraph)
        batch_token_count += paragraph_tokens

    # 摘要最後一批
    if batch:
        batch_summaries.append(summarize_content("\n\n".join(batch)))

    # 將所有批次摘要合併
    combined_summary = "\n\n".join(batch_summaries)

    # 檢查合併後的摘要是否超過 MAX_TOKENS，若超過則再次進行摘要
    if count_tokens(combined_summary) > MAX_TOKENS:
        return summarize_content(combined_summary)

    return combined_summary


# 將統整後的內容插入 summary 表，根據今天或昨天設置 generated_at 的值
def insert_summary(connection, summary_text, target_date):
    generated_at = target_date
    insert_summary_query = "INSERT INTO summary (summary_text, generated_at) VALUES (%s, %s)"
    cursor = connection.cursor()
    cursor.execute(insert_summary_query, (summary_text, generated_at))
    summary_id = cursor.lastrowid
    connection.commit()
    cursor.close()
    return summary_id


# 將新聞與統整後的內容關聯插入 news_summary_sources 表
def insert_news_summary_sources(connection, summary_id, news_ids):
    insert_relation_query = "INSERT INTO news_summary_sources (summary_id, news_id) VALUES (%s, %s)"
    cursor = connection.cursor()
    for news_id in news_ids:
        cursor.execute(insert_relation_query, (summary_id, news_id))
    connection.commit()
    cursor.close()


if __name__ == "__main__":
    # 使用 argparse 來處理命令行參數
    parser = argparse.ArgumentParser(description="選擇要處理的新聞日期")
    parser.add_argument('--date', type=str, choices=['today', 'yesterday'], default='yesterday',
                        help="選擇處理當日新聞或前日新聞 (today, yesterday)")

    args = parser.parse_args()

    # 根據參數選擇日期
    if args.date == 'today':
        target_date = datetime.today().strftime('%Y-%m-%d %H:%M:%S')
    else:
        target_date = (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d 00:00:00')

    connection = create_connection()

    if connection.is_connected():
        # 取得指定日期的新聞摘要
        news = get_news_by_date(connection, target_date.split(" ")[0])

        if news:
            # 將新聞摘要內容拼接
            news_content = "\n\n".join([f"新聞 ID: {n['id']}\n標題: {n['title']}\n內容: {n['content']}" for n in news])

            # 將新聞摘要進行相似性統整，分批處理超過 token 限制的內容
            final_summary = summarize_in_batches(news_content)

            if final_summary:
                # 插入統整後的 summary，根據選擇的日期設置 generated_at
                summary_id = insert_summary(connection, final_summary, target_date)

                # 取得所有新聞的 ID
                news_ids = [news_item['id'] for news_item in news]

                # 插入新聞與統整後的關聯
                insert_news_summary_sources(connection, summary_id, news_ids)

                print(f"{target_date.split(' ')[0]} 的新聞摘要已成功統整並插入資料庫。")
            else:
                print(f"無法生成新聞摘要統整內容。")
        else:
            print(f"{target_date.split(' ')[0]} 沒有新聞資料。")

        connection.close()

```

使用的話後面加上參數，可以決定要總結昨天還今天
```bash
python cynews_crawler.py --date yesterday
```