---
title: GCP k8s 創建並啟用服務範例
date: 2023-12-09 09:58:40
tags:
- [GCP]
- [backend]
- [cloud]
category:
- [GCP]
index_img: ../image/banner/GCP_GKE.png
banner_img: ../image/banner/GCP_k8s_banner.png
---
紀錄google 雲端學習Lab的command
### 設定default region
```shell
gcloud config set compute/region us-east1
```

### 設定default zone
```shell
gcloud config set compute/zone us-east1-d
```
### 創建cluster
```shell
gcloud container clusters create --machine-type=e2-medium --zone=us-east1-d lab-cluster
```
- output
    ```text
    NAME: lab-cluster
    LOCATION: us-east1-d
    MASTER_VERSION: 1.22.8-gke.202
    MASTER_IP: 34.67.240.12
    MACHINE_TYPE: e2-medium
    NODE_VERSION: 1.22.8-gke.202
    NUM_NODES: 3
    STATUS: RUNNING
    ```
### cluster授權
```shell
gcloud container clusters get-credentials lab-cluster
```
- output
    ```text
    Fetching cluster endpoint and auth data.
    kubeconfig entry generated for my-cluster.
    ```
### deploy server to cluster
```shell
kubectl create deployment hello-server --image=gcr.io/google-samples/hello-app:1.0
```
- output
  會從google 抓 docker image 下來, 連結: [https://console.cloud.google.com/gcr/images/google-samples/GLOBAL/hello-app:1.0/details](https://console.cloud.google.com/gcr/images/google-samples/GLOBAL/hello-app:1.0/details)
    ```text
    deployment.apps/hello-server created
    ```
expose port
```shell
kubectl expose deployment hello-server --type=LoadBalancer --port 8080
```
- output
  ```text
  service/hello-server exposed
  ```
### 檢查服務
```shell
kubectl get service
```
- output
  ```text
  NAME             TYPE            CLUSTER-IP      EXTERNAL-IP     PORT(S)           AGE
  hello-server     loadBalancer    10.39.244.36    35.202.234.26   8080:31991/TCP    65s
  kubernetes       ClusterIP       10.39.240.1               433/TCP           5m13s
  ```
### 刪除cluster
```shell
gcloud container clusters delete lab-cluster
```
