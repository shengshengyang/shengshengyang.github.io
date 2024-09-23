---
title: 爬蟲新聞資料後總結重點每日匯報-頁面顯示篇
date: 2024-09-23 22:52:44
tags:
- [java]
- [springboot]
category:
- [java]
index_img: ../image/banner/crawler_index.png
banner_img: ../image/banner/crawler_banner.png
---
呈上篇[爬蟲新聞資料後總結重點每日匯報-ai總結篇](../../../../2024/09/13/crawler-summary-openai)

接下來要將打抓下來重點總結的資訊做顯示，這邊因為我常用語言是`java` 所以就採springboot 快速建立一個頁面

repo: [https://github.com/shengshengyang/news-display-service ](https://github.com/shengshengyang/news-display-service)

首先建立`news` 跟 `summary` 的 table 的 entity

## Entity

#### News

```java
@Entity
@Getter
@Setter
@Table(name = "news")
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(nullable = false, unique = true, length = 255)
    private String link;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false)
    private LocalDate date;

    // 新增與 Summary 的多對多關聯
    @ManyToMany(mappedBy = "newsSources")
    private Set<Summary> summaries;
}
```

#### Summary

```java
@Entity
@Getter
@Setter
@Table(name = "summary")
public class Summary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "summary_text", columnDefinition = "MEDIUMTEXT", nullable = false)
    private String summaryText;

    @Column(name = "generated_at", nullable = false)
    private LocalDate generatedAt;

    // 定義與 News 的多對多關聯
    @ManyToMany
    @JoinTable(
            name = "news_summary_sources",
            joinColumns = @JoinColumn(name = "summary_id"),
            inverseJoinColumns = @JoinColumn(name = "news_id")
    )
    private Set<News> newsSources;
}
```

## Repository
建立與model 相關的repository

#### NewsRepository

```java
@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    List<News> findByCategoryAndDate(String category, LocalDate date);

    List<News> findByCategory(String category);

    List<News> findBySummaries_Id(Long summaryId);
}
```

#### SummaryRepository

```java
public interface SummaryRepository extends JpaRepository<Summary, Long> {

    // 查詢指定日期生成的統整
    List<Summary> findByGeneratedAt(LocalDate generatedAt);
}
```

## Service

新增service 層， 用來做query 之後的分類

```java
@Service
public class SummaryService {

    @Autowired
    SummaryRepository summaryRepository;

    public Map<LocalDate, List<Summary>> getSummariesGroupedByDate() {
        List<Summary> summaries = summaryRepository.findAll();

        // 按日期分組，忽略時間部分
        return summaries.stream()
                .collect(Collectors.groupingBy(Summary::getGeneratedAt));  // 將 Timestamp 轉換為 LocalDate
    }
}

```

## Controller

#### SummaryController

```java
@Controller
public class SummaryController {

    @Autowired
    SummaryRepository summaryRepository;
    @Autowired
    SummaryService summaryService;

    // 顯示單一統整新聞的頁面
    @GetMapping("/summary/{id}")
    public String viewSummary(@PathVariable Long id, Model model) {
        var summary = summaryRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid summary ID"));
        model.addAttribute("summary", summary);
        return "summary";
    }

    // 顯示每日統整列表的頁面
    @GetMapping("/summaries")
    public String viewSummariesByDate(Model model) {
        Map<LocalDate, List<Summary>> summariesByDate = summaryService.getSummariesGroupedByDate();
        model.addAttribute("summariesByDate", summariesByDate);
        return "summary-list";
    }
}
```

## template

這邊是採用`thymeleaf` ,所以會建立 html template

其中大綱的顯示用了`marked` library，比較好儲存及顯示，不用存完整的html 標籤
```html
          <div class="prose max-w-none markdown-content" th:id="'markdown-' + ${summary.id}"></div>

          <!-- 存儲原始 Markdown 文本，用於 JavaScript 處理 -->
          <script type="text/javascript" th:inline="javascript">
            document.addEventListener('DOMContentLoaded', function() {
              let markdownContent = /*[[${summary.summaryText}]]*/ 'Markdown content here';
              let htmlContent = marked(markdownContent);
              document.getElementById('markdown-' + /*[[${summary.id}]]*/ '').innerHTML = htmlContent;
            });
          </script>
```

#### summary-list
```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Summary List</title>
  <script src="https://cdn.jsdelivr.net/npm/marked@3.0.7/marked.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 text-gray-900">

<div class="container mx-auto p-6">
  <h1 class="text-3xl font-bold mb-6 text-center">每日新聞統整</h1>

  <ul>
    <li th:each="entry : ${summariesByDate}" class="mb-8">
      <h2 class="text-2xl font-semibold mb-4 text-blue-700" th:text="${entry.key}">Date</h2> <!-- 顯示日期 -->

      <ul class="space-y-4">
        <li th:each="summary : ${entry.value}" class="bg-white rounded-lg shadow p-6">
          <h3 class="text-xl font-medium mb-2 text-gray-800" th:text="${summary.generatedAt}">Generated At</h3>

          <!-- Markdown Summary -->
          <div class="prose max-w-none markdown-content" th:id="'markdown-' + ${summary.id}"></div>

          <!-- 存儲原始 Markdown 文本，用於 JavaScript 處理 -->
          <script type="text/javascript" th:inline="javascript">
            document.addEventListener('DOMContentLoaded', function() {
              let markdownContent = /*[[${summary.summaryText}]]*/ 'Markdown content here';
              let htmlContent = marked(markdownContent);
              document.getElementById('markdown-' + /*[[${summary.id}]]*/ '').innerHTML = htmlContent;
            });
          </script>

          <!-- Dropdown button for related news -->
          <button type="button" class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition" th:onclick="|toggleNews(${summary.id})|">顯示相關新聞</button>

          <!-- Related News (Dropdown) -->
          <ul th:id="${summary.id}" class="news-list mt-4 hidden space-y-4">
            <li th:each="news : ${summary.newsSources}" class="bg-gray-50 p-4 rounded shadow">
              <h4 class="text-lg font-semibold text-blue-600 mb-1" th:text="${news.title}">News Title</h4>
              <p class="text-gray-700 mb-2" th:text="${news.summary}">News Summary</p>
              <a th:href="${news.link}" class="text-blue-500 underline" th:text="${news.link}">Read More</a>
              <span class="block text-gray-500 text-sm mt-1" th:text="${news.date}">Date</span>
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</div>

<script>
  function toggleNews(id) {
    let element = document.getElementById(id);
    if (element.style.display === "none") {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  }
</script>
</body>
</html>
```

## database setting
由於是透過`JPA` 的ORM 來做連線，所以需要建立`application.properties` 來寫入連線資訊

```properties
spring.application.name=news-display-service
# Database Configuration
spring.datasource.url=jdbc:mysql://<DB_HOST>:<DB_PORT>/<DB_NAME>?useSSL=false
spring.datasource.username=<DB_USERNAME>
spring.datasource.password=<DB_PASSWORD>
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Server Port Configuration
server.port=<SERVER_PORT>
```

## DDL
創建資料表
```sql
-- 創建資料庫
CREATE DATABASE IF NOT EXISTS News;

-- 使用資料庫
USE News;

-- 創建 news 表
CREATE TABLE IF NOT EXISTS news (
                                    id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                    title VARCHAR(255) NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    link VARCHAR(255) UNIQUE NOT NULL, -- 確保新聞的 URL 不會重複
    category VARCHAR(100) NOT NULL,
    date DATE NOT NULL
    );

-- 使用資料庫
USE News;

-- 創建 summary 表，儲存 AI 統整後的內容
CREATE TABLE IF NOT EXISTS summary (
                                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                       summary_text MEDIUMTEXT NOT NULL,   -- AI 統整後的內容
                                       generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 統整生成的時間
);

-- 創建 news_summary_sources 表，關聯新聞與統整內容
CREATE TABLE IF NOT EXISTS news_summary_sources (
                                                    summary_id BIGINT NOT NULL,   -- 參照 summary 表
                                                    news_id BIGINT NOT NULL,      -- 參照 news 表
                                                    PRIMARY KEY (summary_id, news_id), -- 保證每條新聞不會重複對應到同一統整
    FOREIGN KEY (summary_id) REFERENCES summary(id) ON DELETE CASCADE, -- 當統整內容刪除時，相關記錄也會被刪除
    FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE         -- 當新聞被刪除時，相關記錄也會被刪除
    );
```

