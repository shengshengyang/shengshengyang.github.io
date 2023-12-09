---
title: GCP storage 指令使用
date: 2023-12-09 12:17:28
tags:
- [GCP]
- [backend]
- [cloud]
- [k8s]
category:
- [GCP]
- [k8s]
index_img: ../image/banner/GCP_index.png
banner_img: ../image/banner/GCP_banner.jpg
---
### 創建bucket
bucket name 必須為`unique`
```shell
gsutil mb gs://<YOUR-BUCKET-NAME>
```
### 
### 命名規則
1. 不要在桶名稱中包含敏感信息，因為桶的命名空間是全球可見的並且公開可見的。
2. 桶名稱只能包含小寫字母、數字、破折號（-）、下劃線（_）和點（.）。含有點的名稱需要進行驗證。
3. 桶名稱必須以數字或字母開頭和結尾。
4. 桶名稱的長度必須在3到63個字符之間。含有點的名稱最多可以包含222個字符，但每個點分隔的組件不能超過63個字符。
5. 桶名稱不能表示為點分十進位表示法中的IP地址（例如，192.168.5.4）。
6. 桶名稱不能以"goog"前綴開頭。
7. 桶名稱不能包含"google"或接近"google"的拼錯單詞。
8. 為了DNS合規性和未來的兼容性，不應使用底線（_），並且點不應與另一個點或破折號相鄰。例如，".. "或 "-." 或 ".-" 在DNS名稱中是無效的。
### 上傳檔案
```shell
# 下載一個檔
curl https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Ada_Lovelace_portrait.jpg/800px-Ada_Lovelace_portrait.jpg --output ada.jpg
# 上傳
gsutil cp ada.jpg gs://test-test-test-bucket
```
### 複製檔案
```shell
gsutil cp gs://YOUR-BUCKET-NAME/ada.jpg gs://YOUR-BUCKET-NAME/image-folder/
```
- output
  ``` text
  Copying gs://YOUR-BUCKET-NAME/ada.jpg [Content-Type=image/png]...
  - [1 files] [ 360.1 KiB/ 360.1 KiB]
  Operation completed over 1 objects/360.1 KiB
  ```
### 列出檔案
```shell
gsutil ls gs://YOUR-BUCKET-NAME
```
### 列出檔案詳細資訊
```shell
gsutil ls -l gs://YOUR-BUCKET-NAME/ada.jpg
```
- output
    ```shell
    306768  2017-12-26T16:07:570Z  gs://YOUR-BUCKET-NAME/ada.jpg
    TOTAL: 1 objects, 30678 bytes (360.1 KiB)
    ```
### 設定權限
#### 完全變成public 
```shell
gsutil acl ch -u AllUsers:R gs://YOUR-BUCKET-NAME/ada.jpg
```
#### 移除public 權限
```shell
gsutil acl ch -d AllUsers gs://YOUR-BUCKET-NAME/ada.jpg
```
### 刪除bucket
```shell
gsutil rm gs://YOUR-BUCKET-NAME/ada.jpg
```