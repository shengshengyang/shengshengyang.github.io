---
title: spring 設計多階段建構及跨來源資源共享(CORS)
date: 2024-12-27 11:00:04
tags:
- [spring security]
- [springboot]
category:
- [java, springboot]
index_img: ../image/banner/spring_security_index.png
banner_img: ../image/banner/spring_security_banner.png
---
{% note success %}
前篇
- **[spring security](../../../../2024/03/02/spring-security-authenication)**
{% endnote %}

## 前言

這篇主要記錄一個突然想做的做法，然後四處碰壁的結果，由來是原本我是按照單一前後台的方式做設計，於是原有的config 在同一個檔，包含登入登出跟頁面訪問跟exception 處理
```java
 @Bean
    public SecurityFilterChain webSecurityFilterChain(
            HttpSecurity http,
            DaoAuthenticationProvider authenticationProvider
    ) throws Exception {

        http
                // 使用我們自定義的 DaoAuthenticationProvider
                .authenticationProvider(authenticationProvider)
                // 設定路徑與權限
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/attendance/**", "/user/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/css/**", "/js/**", "/images/**", "/assets/**").permitAll()
                        .anyRequest().permitAll()
                )
                // 表單登入
                .formLogin(form -> form
                        .loginPage(LOGIN_URL)
                        .loginProcessingUrl(LOGIN_URL)
                        .successHandler(successHandler)
                        .failureUrl(LOGIN_URL + "?error")
                        .permitAll()
                )
                // 登出
                .logout(logout -> logout
                        .logoutRequestMatcher(new AntPathRequestMatcher("/logout", "POST"))
                        .logoutSuccessHandler(logoutSuccessHandler)
                        .permitAll()
                )
                // 異常處理 (未認證 / 無權限)
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> response.sendRedirect(LOGIN_URL))
                        .accessDeniedHandler((request, response, accessDeniedException) -> response.sendRedirect("/403"))
                );

        return http.build();
    }
```

{% label danger @但是我突然想在同一個專案開api 😊😊 %} 
{% label info @於是我就開始了我的痛苦之旅 %}

## config 共用

首先我照舊寫了另外一個api 專用的 config
```java
@Bean
    public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/login", "/api/register").permitAll()
                        .anyRequest().authenticated() // 其他 /api/** 路徑需要認證
                )
                // API 通常是「無狀態」，所以關閉 Session
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // 在 UsernamePasswordAuthenticationFilter 之前放置 JWT filter
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
        ;

        return http.build();
    }
```
然後就發現 全部request 都被擋掉 不管怎麼弄都一樣，看著看著發現，這條好像跟著走去web 的設定那段了，api 這段一般也不會加上csrf token, 還有url 被security 共用的問題，於是作了以下變動

### 優化: 增加序列

在兩段config 加上序列`@Order`，讓spring security 知道誰要先執行，並指忽略api/** 的csrf token

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@Order(1)  // 設定優先處理此組 FilterChain
public class ApiSecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;

    public ApiSecurityConfig(JwtRequestFilter jwtRequestFilter) {
        this.jwtRequestFilter = jwtRequestFilter;
    }

    @Bean
    public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/login", "/api/register").permitAll()
                        .anyRequest().authenticated() // 其他 /api/** 路徑需要認證
                )
                // 關閉 CSRF (REST API 常見做法)
                // 只忽略 /api/** 的 CSRF
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/api/**")
                )
                // API 通常是「無狀態」，所以關閉 Session
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // 在 UsernamePasswordAuthenticationFilter 之前放置 JWT filter
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
        ;

        return http.build();
    }

}
```

然後發現程式正常跑了，但是又發現一個問題，就是跨來源資源共享(CORS)的問題

### 優化: 跨來源資源共享(CORS)

一開始使用了全局的config


```java
package com.example.clockin.config;

import com.example.clockin.util.Constants;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CrossOriginsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")  // 只對 /api/** 路徑開放 CORS
                .allowedOrigins(Constants.LOCAL_FRONT_HOST)  // 允許的來源
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // 允許的 HTTP 方法
                .allowedHeaders("*")  // 允許所有的請求頭
                .allowCredentials(true);  // 允許攜帶憑證
    }
}
```

但發現不管我怎麼送都是403，後來發現是因為阿~~~好像這樣沒有設定在API 端阿，於是我就把config 改成這樣

以下是spring security 6 之後的寫法，因為不再支援.cors().disable()，所以要用這種方式設定

```java
@Configuration
@EnableMethodSecurity
@Order(1)  // 設定優先處理此組 FilterChain
public class ApiSecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;

    public ApiSecurityConfig(JwtRequestFilter jwtRequestFilter) {
        this.jwtRequestFilter = jwtRequestFilter;
    }

    @Bean
    public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/login", "/api/register").permitAll()
                        .anyRequest().authenticated() // 其他 /api/** 路徑需要認證
                )
                // 關閉 CSRF (REST API 常見做法)
                // 只忽略 /api/** 的 CSRF
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/api/**")
                )
                // API 通常是「無狀態」，所以關閉 Session
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // 在 UsernamePasswordAuthenticationFilter 之前放置 JWT filter
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
        ;

        return http.build();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(Constants.LOCAL_FRONT_HOST)); // 允許的來源
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE")); // 允許的 HTTP 方法
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type")); // 允許的請求頭
        configuration.setAllowCredentials(true); // 是否允許攜帶 Cookie 或憑證

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration); // 將配置應用於 /api/** 路徑
        return source;
    }

}
```

然後就可以送了-> 接著測試登入，發現又是403😒??

後來發現是jwt filter 那邊也要排除


### 優化: 排除jwt filter
      // Skip JWT validation for specific endpoints 那段就是後來加上去的

```java
@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private static final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);
    
    @Autowired
    public JwtRequestFilter(UserDetailsService userDetailsService,
                            JwtUtil jwtUtil) {
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(
            @NotNull HttpServletRequest request,
            @NotNull HttpServletResponse httpServletResponse,
            @NotNull FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();

        // Skip JWT validation for specific endpoints
        if ("/api/login".equals(path) || "/api/register".equals(path)) {
            logger.info("Skipping JWT validation for path: {}", path);
            filterChain.doFilter(request, httpServletResponse);
            return;
        }


        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        try {
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                jwt = authorizationHeader.substring(7);
                username = jwtUtil.extractUsername(jwt);
                logger.info("Validating JWT for user: {}", username);
            }

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

                if (Boolean.TRUE.equals(jwtUtil.validateToken(jwt, userDetails.getUsername()))) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities()
                            );
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.info("JWT validation successful for user: {}", username);
                } else {
                    logger.warn("JWT validation failed for user: {}", username);
                }
            }
        } catch (Exception e) {
            logger.error("JWT validation error: {}", e.getMessage());
        }
        filterChain.doFilter(request, httpServletResponse);
        logger.info("Request processing completed for path: {}", path);
    }

}

```

然後就可以送了 可喜可樂，希望不要再有奇怪的想法出現，還是乖乖地拆成兩個小專案比較簡單
