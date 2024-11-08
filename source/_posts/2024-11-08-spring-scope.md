---
title: Spring Scope
date: 2024-11-08 16:04:56
tags:
- [backend]
- [java]
- [spring]
categories:
- [java]
index_img: ../image/banner/java_index.jpg
banner_img: ../image/banner/java_banner_brown.jpg
---
# Spring Scope

在 Spring 框架中，Scope（範圍）是用來定義 Bean 的{% label success @生命週期和可用性範圍%}的設定。不同的 Scope 影響 Bean 的創建、存活和回收方式。

## Singleton

Singleton 表示 Spring 容器中的 Bean {%label danger @只會有一個實例%}。
- 預設 Scope：當不指定 Scope 時，Spring 會使用 Singleton。
- 生命週期：在 Spring 容器啟動時創建一個 Bean 實例，並在整個應用程序的生命週期中共享這個實例。
- 用法：通常用於需要共享狀態或共享數據的場景。

### 應用場景：飯店基本資訊管理
在飯店管理系統中，飯店的基本資訊（如飯店名稱、地址、聯絡方式等）在整個應用程序中都是固定且共享的。我們可以使用 Singleton 範圍的 Bean 來管理這些資訊，確保所有地方都引用同一個實例。

```java
// HotelInfoService.java
package com.example.hotelmanagement.service;

import org.springframework.stereotype.Service;

@Service // 預設為 Singleton 範圍
public class HotelInfoService {
    private String hotelName = "豪華大飯店";
    private String address = "台北市信義區信義路100號";
    private String contactNumber = "02-1234-5678";

    // Getter 和 Setter 方法
    public String getHotelName() { return hotelName; }
    public void setHotelName(String hotelName) { this.hotelName = hotelName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
}

```

```java
// HotelInfoController.java
package com.example.hotelmanagement.controller;

import com.example.hotelmanagement.service.HotelInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HotelInfoController {

    @Autowired
    private HotelInfoService hotelInfoService;

    @GetMapping("/hotelInfo")
    public String getHotelInfo() {
        return "飯店名稱：" + hotelInfoService.getHotelName() +
                ", 地址：" + hotelInfoService.getAddress() +
                ", 聯絡電話：" + hotelInfoService.getContactNumber();
    }
}

```

## Prototype（原型）

- 生命週期：每次請求 Bean 時，Spring 會創建一個新的實例。也就是說，對於每次的依賴注入，都會得到一個新的 Bean 實例。
- 用法：適用於需要獨立狀態或不應共享的場景。

### 應用場景：客房清潔任務管理
在飯店中，客房清潔是常見的任務，每個清潔任務都應該是獨立的。我們可以使用 Prototype 範圍的 Bean 來表示每個清潔任務，確保每次創建的清潔任務都是新的實例。

```java
// CleaningTask.java
package com.example.hotelmanagement.model;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope("prototype") // 指定為 Prototype 範圍
public class CleaningTask {
    private String roomNumber;
    private String cleanerName;

    public CleaningTask() {
        // 無參數建構子
    }

    // Getter 和 Setter 方法
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getCleanerName() { return cleanerName; }
    public void setCleanerName(String cleanerName) { this.cleanerName = cleanerName; }
}

```
定義服務來管理清潔任務
```java
// CleaningService.java
package com.example.hotelmanagement.service;

import com.example.hotelmanagement.model.CleaningTask;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Lookup;
import org.springframework.stereotype.Service;

@Service
public class CleaningService {

    // 使用 @Lookup 來獲取 Prototype 範圍的 Bean
    @Lookup
    public CleaningTask getCleaningTask() {
        // Spring 會自動覆蓋此方法，返回新的 CleaningTask 實例
        return null;
    }

    public void startCleaning(String roomNumber, String cleanerName) {
        CleaningTask cleaningTask = getCleaningTask();
        cleaningTask.setRoomNumber(roomNumber);
        cleaningTask.setCleanerName(cleanerName);

        // 處理清潔邏輯，例如記錄清潔開始時間等
        System.out.println("開始清潔房間：" + cleaningTask.getRoomNumber() +
                ", 清潔人員：" + cleaningTask.getCleanerName());
    }
}

```

## Request（請求）

- 生命週期：在基於 web 的應用中，每次 HTTP 請求都會創建一個新的 Bean 實例。當請求結束時，Bean 會被銷毀。
- 用法：適用於需要在每次請求中擁有獨立狀態的 Bean，例如控制器中使用的資料。

### 應用場景：客房預訂請求管理
每個客戶在預訂房間時，都會發出一個獨立的請求。我們可以使用 Request 範圍的 Bean 來保存每個預訂請求的資料，確保請求之間的資料不會互相干擾。

```java
// BookingRequest.java
package com.example.hotelmanagement.model;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.web.context.WebApplicationContext;

@Component
@Scope(value = WebApplicationContext.SCOPE_REQUEST) // 指定為 Request 範圍
public class BookingRequest {
    private String roomType;
    private String checkInDate;
    private String checkOutDate;

    // Getter 和 Setter 方法
    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public String getCheckInDate() { return checkInDate; }
    public void setCheckInDate(String checkInDate) { this.checkInDate = checkInDate; }

    public String getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(String checkOutDate) { this.checkOutDate = checkOutDate; }
}
```

定義預訂服務

```java
// BookingService.java
package com.example.hotelmanagement.service;

import com.example.hotelmanagement.model.BookingRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BookingService {

    @Autowired
    private BookingRequest bookingRequest; // 每個請求都會產生新的實例

    public String processBooking() {
        // 處理預訂邏輯，例如保存到資料庫等
        String confirmation = "已成功預訂 " + bookingRequest.getRoomType() +
                              "，入住日期：" + bookingRequest.getCheckInDate() +
                              "，退房日期：" + bookingRequest.getCheckOutDate();
        return confirmation;
    }
}

```

## Session（會話）
- 生命週期：在基於 web 的應用中，每個 HTTP 會話都會創建一個 Bean 實例，並在會話結束時銷燬。
- 用法：適用於需要在同一會話中共享狀態的 Bean。

```java
// CustomerSession.java
package com.example.hotelmanagement.model;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.web.context.WebApplicationContext;

import java.util.ArrayList;
import java.util.List;

@Component
@Scope(value = WebApplicationContext.SCOPE_SESSION) // 指定為 Session 範圍
public class CustomerSession {
    private String customerId;
    private List<String> selectedRoomTypes = new ArrayList<>();

    // Getter 和 Setter 方法
    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public List<String> getSelectedRoomTypes() { return selectedRoomTypes; }
    public void addSelectedRoomType(String roomType) { this.selectedRoomTypes.add(roomType); }
}

```

定義客戶服務

```java
// CustomerService.java
package com.example.hotelmanagement.service;

import com.example.hotelmanagement.model.CustomerSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

    @Autowired
    private CustomerSession customerSession; // 在同一會話中共享

    public void selectRoom(String roomType) {
        customerSession.addSelectedRoomType(roomType);
    }

    public List<String> getSelectedRooms() {
        return customerSession.getSelectedRoomTypes();
    }
}

```
在控制器中使用 CustomerService

```java
// CustomerController.java
package com.example.hotelmanagement.controller;

import com.example.hotelmanagement.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @PostMapping("/selectRoom")
    public String selectRoom(@RequestParam String roomType) {
        customerService.selectRoom(roomType);
        return "已選擇房型：" + roomType;
    }

    @GetMapping("/selectedRooms")
    public List<String> getSelectedRooms() {
        return customerService.getSelectedRooms();
    }
}

```

## Global Session（全局會話）
- 生命週期：主要用於 Portlet 應用中，與 Session 類似，但會在全局範圍內共享。
- 用法：用於需要在全局會話中共享狀態的場景。

### 應用場景：跨飯店聯盟的會員折扣管理
在飯店管理系統中，可能存在一個飯店聯盟，允許會員在不同的飯店之間享受統一的會員折扣。我們可以使用 Global Session 範圍的 Bean 來管理這些跨應用程序共享的會員資料。

```java
// MemberDiscountSession.java
package com.example.hotelmanagement.model;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.web.context.WebApplicationContext;

@Component
@Scope(value = WebApplicationContext.SCOPE_GLOBAL_SESSION) // 指定為 Global Session 範圍
public class MemberDiscountSession {
    private String memberId;
    private double discountRate;

    // Getter 和 Setter 方法
    public String getMemberId() { return memberId; }
    public void setMemberId(String memberId) { this.memberId = memberId; }

    public double getDiscountRate() { return discountRate; }
    public void setDiscountRate(double discountRate) { this.discountRate = discountRate; }
}
```
定義服務來管理會員折扣
```java
// MemberService.java
package com.example.hotelmanagement.service;

import com.example.hotelmanagement.model.MemberDiscountSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MemberService {

    @Autowired
    private MemberDiscountSession memberDiscountSession; // 跨應用共享

    public void applyDiscount(String memberId) {
        // 假設從資料庫或其他服務獲取會員的折扣率
        double discount = fetchDiscountRateFromDatabase(memberId);
        memberDiscountSession.setMemberId(memberId);
        memberDiscountSession.setDiscountRate(discount);
    }

    private double fetchDiscountRateFromDatabase(String memberId) {
        // 模擬從資料庫獲取折扣率
        return 0.1; // 10% 的折扣
    }

    public double getMemberDiscount() {
        return memberDiscountSession.getDiscountRate();
    }
}

```
在控制器中使用 MemberService
```java
// MemberController.java
package com.example.hotelmanagement.controller;

import com.example.hotelmanagement.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/member")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @PostMapping("/applyDiscount")
    public String applyDiscount(@RequestParam String memberId) {
        memberService.applyDiscount(memberId);
        return "已為會員 " + memberId + " 應用折扣";
    }

    @GetMapping("/getDiscount")
    public String getDiscount() {
        double discount = memberService.getMemberDiscount();
        return "當前會員折扣：" + (discount * 100) + "%";
    }
}

```

##  Application（應用）
- 生命週期：在 Spring 容器中，這個 Scope 在整個應用上下文中都共享。類似於 Singleton，但通常用於與多個 Servlet 應用程序一起運行的情況。
- 用法：適用於需要跨應用共享的情況。

```java
// SystemConfig.java
package com.example.hotelmanagement.config;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope("application") // 指定為 Application 範圍
public class SystemConfig {
    private String currency = "TWD";
    private double taxRate = 0.05; // 5% 的稅率
    private String businessHours = "24/7";

    // Getter 和 Setter 方法
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public double getTaxRate() { return taxRate; }
    public void setTaxRate(double taxRate) { this.taxRate = taxRate; }

    public String getBusinessHours() { return businessHours; }
    public void setBusinessHours(String businessHours) { this.businessHours = businessHours; }
}

```
BillingService
```java
// BillingService.java
package com.example.hotelmanagement.service;

import com.example.hotelmanagement.config.SystemConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BillingService {

    @Autowired
    private SystemConfig systemConfig; // 全局共享的系統配置

    public double calculateTotal(double amount) {
        double tax = amount * systemConfig.getTaxRate();
        return amount + tax;
    }

    public String getCurrency() {
        return systemConfig.getCurrency();
    }
}
```
BillingController
```java
// BillingController.java
package com.example.hotelmanagement.controller;

import com.example.hotelmanagement.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/billing")
public class BillingController {

    @Autowired
    private BillingService billingService;

    @GetMapping("/calculate")
    public String calculateTotal(@RequestParam double amount) {
        double total = billingService.calculateTotal(amount);
        String currency = billingService.getCurrency();
        return "總金額：" + total + " " + currency;
    }
}

```

## Websocket（Websocket）
- 生命週期：適用於 Websocket 應用中，每個 Websocket 連接會創建一個新的 Bean 實例。
- 用法：適合需要為每個 Websocket 連接維護獨立狀態的場景。

### 應用場景：即時客戶服務聊天系統
飯店管理系統可能需要一個即時的客戶服務聊天系統，讓客戶可以隨時與客服人員聯繫。每個客戶的聊天連接都是獨立的，需要維護各自的聊天狀態。我們可以使用 Websocket 範圍的 Bean 來管理每個連接的狀態。

配置 WebSocket
```java
// WebSocketConfig.java
package com.example.hotelmanagement.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker // 啟用 WebSocket 消息代理
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/chat") // 定義 WebSocket 連接端點
                .setAllowedOrigins("*")
                .withSockJS(); // 支持 SockJS
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic"); // 定義消息代理的前綴
        registry.setApplicationDestinationPrefixes("/app"); // 定義應用程序發送消息的前綴
    }
}

```

定義 Websocket 範圍的 Bean
```java
// ChatSession.java
package com.example.hotelmanagement.model;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@Scope("websocket") // 指定為 WebSocket 範圍
public class ChatSession {
    private String sessionId;
    private List<String> messages = new ArrayList<>();

    // Getter 和 Setter 方法
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public List<String> getMessages() { return messages; }
    public void addMessage(String message) { this.messages.add(message); }
}

```

定義聊天服務
```java
// ChatService.java
package com.example.hotelmanagement.service;

import com.example.hotelmanagement.model.ChatSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    @Autowired
    private ChatSession chatSession; // 每個 WebSocket 連接都有自己的實例

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void handleMessage(String message) {
        // 保存消息到會話中
        chatSession.addMessage(message);

        // 將消息發送給對應的客戶端
        messagingTemplate.convertAndSend("/topic/messages", message);
    }
}

```

定義聊天控制器

```java
// ChatController.java
package com.example.hotelmanagement.controller;

import com.example.hotelmanagement.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private ChatService chatService;

    @MessageMapping("/sendMessage") // 處理從客戶端發送的消息
    public void receiveMessage(String message) {
        chatService.handleMessage(message);
    }
}

```

客戶端示例（使用 JavaScript 和 SockJS）

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
    <title>飯店客服聊天系統</title>
    <script src="https://cdn.jsdelivr.net/npm/sockjs-client/dist/sockjs.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/stompjs/lib/stomp.min.js"></script>
</head>
<body>
    <h1>飯店客服聊天系統</h1>
    <div id="chat">
        <!-- 聊天內容 -->
    </div>
    <input type="text" id="messageInput" placeholder="輸入訊息">
    <button onclick="sendMessage()">發送</button>

    <script>
        var stompClient = null;

        function connect() {
            var socket = new SockJS('/chat');
            stompClient = Stomp.over(socket);
            stompClient.connect({}, function (frame) {
                console.log('Connected: ' + frame);
                stompClient.subscribe('/topic/messages', function (messageOutput) {
                    showMessage(JSON.parse(messageOutput.body));
                });
            });
        }

        function sendMessage() {
            var message = document.getElementById('messageInput').value;
            stompClient.send("/app/sendMessage", {}, message);
            document.getElementById('messageInput').value = '';
        }

        function showMessage(message) {
            var chat = document.getElementById('chat');
            var messageElement = document.createElement('div');
            messageElement.innerHTML = message;
            chat.appendChild(messageElement);
        }

        connect();
    </script>
</body>
</html>

```

## 比較
| Scope            | 生命週期                                       | 使用場景                                | 主要特性                                 |
|------------------|------------------------------------------------|----------------------------------------|------------------------------------------|
| Singleton        | 整個 Spring 應用上下文生命週期                 | 配置類、全局參數                        | 單一實例，適合共享不變數據               |
| Prototype        | 每次請求一個新實例                             | 每個請求需獨立數據的操作                | 每次請求創建新實例                       |
| Request          | 每個 HTTP 請求期間有效                         | Web 應用中，需與 HTTP 請求一致的操作     | 每個請求中創建新實例，請求結束自動銷毀   |
| Session          | 每個 HTTP 會話期間有效                         | Web 應用中，需保存會話數據的操作         | 每個會話中創建新實例，會話結束自動銷毀   |
| Global Session   | 每個全局會話期間有效（主要用於 Portlet 應用）   | Portlet 應用中，需跨多個應用的會話共享數據 | 跨 Portlet 的全局會話範圍                 |
| Application      | 整個 Web 應用生命週期                         | Web 應用中，跨所有請求共享數據           | 跨 Web 應用程序共享單一實例               |
| WebSocket        | 每個 WebSocket 連接期間有效                   | WebSocket 應用中，每個連接獨立數據       | 每個 WebSocket 連接獨立實例，連接關閉銷毀 |
