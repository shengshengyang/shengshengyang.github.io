---
title: android manifest 及相機權限變動
date: 2024-09-16 11:13:17
tags:
- [android]
category:
- [android]
index_img: ../image/banner/android_index.png
banner_img: ../image/banner/android_banner.png
---
## <manifest> 標籤的結構及重點

### 1. 根標籤及命名

```xml

<manifest xmlns:android="http://schemas.android.com/apk/res/android"
          package="com.example.myapp">
    <!-- 其他內容 -->
</manifest>
```

- `xmlns:android`：定義了 XML 命名空間，所有 Android 屬性都需使用 {% label success @android: %} 前綴。
- `package`：定義應用的唯一名，通常反映應用的組織結構。

### 2. 權限聲明

- 在 `<manifest>` 中使用 <span class="label label-danger">\<uses-permission\></span> 標籤聲明應用所需的權限。這些權限決定了應用可以訪問的系統資源和用戶數據。

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA"/>
<!-- 其他權限 -->
```

### 3. 應用組件聲明

- `<application>` 標籤內部聲明應用的各個組件，如 Activity、Service、BroadcastReceiver、ContentProvider 等。

```xml
<application
    android:allowBackup="true"
    android:icon="@mipmap/ic_launcher"
    android:label="@string/app_name"
    android:roundIcon="@mipmap/ic_launcher_round"
    android:supportsRtl="true"
    android:theme="@style/AppTheme">
    
    <!-- 主 Activity -->
    <activity android:name=".MainActivity">
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
    </activity>
    
    <!-- 其他 Activity -->
    <activity android:name=".SecondActivity" />
    
    <!-- 服務、接收器、提供者等 -->
    <!-- ... -->
    
</application>
```

### 4. 應用屬性

`android:allowBackup`：允許或禁止應用數據備份。
`android:icon` 和 `android:roundIcon`：定義應用的圖標。
`android:label`：應用的名稱。
`android:supportsRtl`：是否支持從右到左的語言。
`android:theme`：應用的主題樣式。

### 5. 組件聲明

- `Activity`：應用的用戶界面組件。

    ```xml
    <activity android:name=".MainActivity">
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
    </activity>
    ```

    - android:name：活動的完整名或相對路徑。
    - \<intent-filter\>：定義活動可以響應的範圍（如啟動活動）。
- `Service`：應用在後台執行的組件。
  ```xml
  <service android:name=".MyService" />
  ```
- `BroadcastReceiver`：接收廣播的組件。
  ```xml
  <receiver android:name=".MyReceiver">
    <intent-filter>
        <action android:name="android.intent.action.BOOT_COMPLETED" />
    </intent-filter>
  </receiver>
  ```
- `ContentProvider`：應用提供數據共享的組件。
  ```xml
    <provider
    android:name=".MyContentProvider"
    android:authorities="com.example.myapp.provider"
    android:exported="false" />
  ```
### 6. 其他標籤
- `<uses-feature>`：聲明應用需要或可選的硬體或軟體特性。
  ```xml
    <uses-feature android:name="android.hardware.camera" android:required="true" />
  ```
- `<application>` 內的其他屬性和子標籤：如 meta-data、provider 等。

### 範例
相機權限的變動可以參考
[https://blog.csdn.net/guolin_blog/article/details/137410229](https://blog.csdn.net/guolin_blog/article/details/137410229)

我是從12 --> 13 --> 14 版本變動都有做更新，尤其針對相機圖片隱私這塊google 是越做越多，做起來也確實繁瑣。

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.myapp">

    <!-- 權限聲明 -->
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA"/>
    <uses-permission android:name="android.permission.INTERNET" />
    <!-- 針對 Android 12 (API level 32) 或更低版本 -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    <!-- 針對 Android 13 (API level 33) 或更高版本 -->
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
    <!-- 針對 Android 14 (API level 34) -->
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">

        <!-- 主 Activity -->
        <activity android:name=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- 其他 Activity -->
        <activity android:name=".SecondActivity" />

        <!-- 服務 -->
        <service android:name=".MyService" />

        <!-- 接收器 -->
        <receiver android:name=".MyReceiver">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
            </intent-filter>
        </receiver>

        <!-- 提供者 -->
        <provider
            android:name=".MyContentProvider"
            android:authorities="com.example.myapp.provider"
            android:exported="false" />

    </application>

</manifest>

```