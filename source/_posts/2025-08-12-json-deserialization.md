---
title: Spring Jackson 序列化反序列化
date: 2025-08-12 15:26:23
tags:
- [Spring]
- [Jackson]
- [RestTemplate]
categories:
- [backend, Spring Framework]
index_img: ../image/banner/spring_jackson_index.png
---

## 前言

在 Spring 應用程式中使用 RestTemplate 進行 API 呼叫時，經常遇到一個令人困惑的問題：回傳的 JSON 資料中的 Object 類型會被自動轉換為 `LinkedHashMap`，導致後續無法直接使用強型別的物件。

## 問題現象

### 典型錯誤場景

```java
// API 回傳結果
ApiResponse apiResponse = restTemplate.exchange(url, HttpMethod.POST, requestEntity, ApiResponse.class);

// 當嘗試轉換 data 欄位時出現錯誤
if (apiResponse.getData() instanceof LinkedHashMap) {
    // 這裡會拋出 IllegalArgumentException: Unrecognized field
    ObjectMapper mapper = new ObjectMapper();
    MyDto convertedData = mapper.convertValue(apiResponse.getData(), MyDto.class);
}
```

### 常見錯誤訊息

```
java.lang.IllegalArgumentException: Unrecognized field "isDiplomat" 
(class com.example.dto.UserDto), not marked as ignorable
```

## 問題根本原因

### 為什麼會變成 LinkedHashMap？

Spring 的 RestTemplate 在反序列化 JSON 時，對於泛型類型的處理存在局限性：

1. **類型擦除**：Java 的泛型在執行時會被擦除，`ApiResponse<T>` 變成 `ApiResponse`
2. **預設行為**：Jackson 無法確定具體的泛型類型，會將嵌套物件轉換為 `LinkedHashMap`
3. **缺乏類型資訊**：RestTemplate 只知道最外層的類型，對於內層的泛型類型無從得知

### JSON 結構示例

```json
{
  "code": "2000",
  "message": "Success",
  "data": {
    "id": "123",
    "name": "測試用戶",
    "isDiplomat": false
  }
}
```

## 解決方案詳解

### 方案 1：配置 ObjectMapper 忽略未知欄位（推薦）

這是最簡單且實用的解決方案：

```java
@Override
public ApiResponse postRequest(String endpoint, Object requestBody) {
    // ... RestTemplate 呼叫邏輯
    
    if (apiResponse != null && apiResponse.getData() instanceof LinkedHashMap) {
        ObjectMapper mapper = new ObjectMapper();
        // 關鍵配置：忽略未知欄位
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.configure(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES, false);
        mapper.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
        
        Object convertedData = mapper.convertValue(apiResponse.getData(), TargetDto.class);
        apiResponse.setData(convertedData);
    }
    return apiResponse;
}
```

### 方案 2：使用 ParameterizedTypeReference

保持完整的泛型類型資訊：

```java
public <T> ApiResponse<T> postRequest(String endpoint, Object requestBody, Class<T> responseType) {
    try {
        String url = buildUrl(endpoint);
        HttpEntity<Object> requestEntity = new HttpEntity<>(requestBody, headers);

        // 使用 ParameterizedTypeReference 保持泛型類型
        ParameterizedTypeReference<ApiResponse<T>> typeRef = 
            ParameterizedTypeReference.forType(
                ResolvableType.forClassWithGenerics(ApiResponse.class, responseType).getType()
            );

        ResponseEntity<ApiResponse<T>> response = restTemplate.exchange(
            url, HttpMethod.POST, requestEntity, typeRef);

        return response.getBody();
    } catch (Exception e) {
        log.error("Request failed: {}", e.getMessage(), e);
        throw new ApiException("API_ERROR", endpoint);
    }
}
```

### 方案 3：使用 TypeReference（最靈活）

```java
public <T> ApiResponse<T> postRequest(String endpoint, Object requestBody, 
                                    TypeReference<ApiResponse<T>> typeReference) {
    try {
        String url = buildUrl(endpoint);
        HttpEntity<Object> requestEntity = new HttpEntity<>(requestBody, headers);

        // 先取得原始 JSON 字串
        ResponseEntity<String> response = restTemplate.exchange(
            url, HttpMethod.POST, requestEntity, String.class);

        // 手動反序列化，保持完整類型資訊
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        
        return objectMapper.readValue(response.getBody(), typeReference);
    } catch (Exception e) {
        log.error("Request failed: {}", e.getMessage(), e);
        throw new ApiException("API_ERROR", endpoint);
    }
}

// 使用方式
TypeReference<ApiResponse<UserDto>> typeRef = new TypeReference<ApiResponse<UserDto>>() {};
ApiResponse<UserDto> result = postRequest(endpoint, requestBody, typeRef);
```

### 方案 4：全域 ObjectMapper 配置

在配置類中統一設定：

```java
@Configuration
public class JacksonConfig {
    
    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        
        // 忽略未知欄位
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        
        // 處理 null 值
        mapper.configure(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES, false);
        
        // 空字串轉 null
        mapper.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
        
        // 日期格式處理
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        
        return mapper;
    }
    
    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        
        // 使用自訂的 ObjectMapper
        List<HttpMessageConverter<?>> messageConverters = restTemplate.getMessageConverters();
        messageConverters.removeIf(converter -> converter instanceof MappingJackson2HttpMessageConverter);
        messageConverters.add(new MappingJackson2HttpMessageConverter(objectMapper()));
        
        return restTemplate;
    }
}
```

## DTO 設計最佳實踐

### 使用 JsonIgnoreProperties 註解

```java
@JsonIgnoreProperties(ignoreUnknown = true)  // 類別層級忽略未知欄位
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private String id;
    private String name;
    
    // 處理欄位名稱不一致
    @JsonProperty("isDiplomat")
    private Boolean diplomat;
    
    // 處理可能為 null 的原始型別
    private Boolean isActive;  // 使用 Boolean 而非 boolean
    
    // 日期處理
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthday;
    
    // 忽略特定欄位
    @JsonIgnore
    private String internalField;
}
```

### 處理不同的資料類型

```java
public class DataTypeHandlingDto {
    // 數字類型處理
    @JsonProperty("count")
    private Integer count;  // 可能為 null，使用包裝類型
    
    // 列表處理
    @JsonProperty("tags")
    private List<String> tags = new ArrayList<>();  // 提供預設值
    
    // 嵌套物件處理
    @JsonProperty("address")
    private AddressDto address;
    
    // 自訂反序列化
    @JsonDeserialize(using = CustomDateDeserializer.class)
    private Date customDate;
}
```

## 錯誤處理和調試

### 調試技巧

```java
public ApiResponse debugConversion(String endpoint, Object requestBody) {
    ApiResponse apiResponse = callApi(endpoint, requestBody);
    
    if (apiResponse != null && apiResponse.getData() instanceof LinkedHashMap) {
        LinkedHashMap<String, Object> rawData = (LinkedHashMap<String, Object>) apiResponse.getData();
        
        // 調試輸出
        log.info("Raw data keys: {}", rawData.keySet());
        log.info("Raw data structure: {}", rawData);
        
        // 檢查特定欄位
        rawData.forEach((key, value) -> {
            log.info("Field: {} = {} (type: {})", 
                key, value, value != null ? value.getClass().getSimpleName() : "null");
        });
        
        try {
            ObjectMapper mapper = createConfiguredMapper();
            Object convertedData = mapper.convertValue(rawData, TargetDto.class);
            apiResponse.setData(convertedData);
        } catch (IllegalArgumentException e) {
            log.error("Conversion failed for field: {}", e.getMessage());
            // 根據需要決定是否拋出異常或繼續處理
            throw new DataConversionException("Failed to convert API response", e);
        }
    }
    return apiResponse;
}

private ObjectMapper createConfiguredMapper() {
    ObjectMapper mapper = new ObjectMapper();
    mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    mapper.configure(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES, false);
    mapper.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
    return mapper;
}
```

### 常見錯誤及解決方法

| 錯誤類型 | 原因 | 解決方法 |
|---------|------|---------|
| Unrecognized field | JSON 欄位在 DTO 中不存在 | 使用 `@JsonIgnoreProperties(ignoreUnknown = true)` |
| Cannot deserialize value | 資料類型不匹配 | 檢查 DTO 欄位類型，使用包裝類型 |
| Failed on null for primitives | primitive 類型接收到 null | 改用包裝類型 (Boolean, Integer 等) |
| Date parsing error | 日期格式不匹配 | 使用 `@JsonFormat` 指定格式 |

## 效能考量

### ObjectMapper 重用

```java
@Component
public class ApiResponseConverter {
    
    private final ObjectMapper objectMapper;
    
    public ApiResponseConverter() {
        this.objectMapper = new ObjectMapper();
        configureMapper();
    }
    
    private void configureMapper() {
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        objectMapper.configure(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES, false);
        // ... 其他配置
    }
    
    public <T> T convertValue(Object fromValue, Class<T> toValueType) {
        return objectMapper.convertValue(fromValue, toValueType);
    }
}
```

### 快取 TypeReference

```java
@Component
public class TypeReferenceCache {
    
    private final Map<Class<?>, TypeReference<?>> cache = new ConcurrentHashMap<>();
    
    @SuppressWarnings("unchecked")
    public <T> TypeReference<ApiResponse<T>> getApiResponseTypeReference(Class<T> dataType) {
        return (TypeReference<ApiResponse<T>>) cache.computeIfAbsent(dataType, 
            k -> new TypeReference<ApiResponse<T>>() {});
    }
}
```

## 最佳實踐總結

1. **優先使用方案 1**：配置 ObjectMapper 忽略未知欄位，簡單有效
2. **DTO 設計**：
    - 使用 `@JsonIgnoreProperties(ignoreUnknown = true)`
    - 使用包裝類型 (Boolean, Integer) 而非原始類型
    - 合適使用 `@JsonProperty` 處理欄位名稱對應
3. **全域配置**：在生產環境中建議配置全域的 ObjectMapper
4. **錯誤處理**：提供詳細的調試資訊，方便問題定位
5. **效能優化**：重用 ObjectMapper 實例，避免重複建立

## 結語

LinkedHashMap 轉換問題是 Spring + Jackson 開發中的常見議題，理解其成因並選擇合適的解決方案，可以大幅提升開發效率。建議根據專案的複雜度選擇最適合的方案，同時注意效能和維護性的平衡。
