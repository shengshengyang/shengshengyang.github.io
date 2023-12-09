---
title: gcp api 部屬及建立範例
date: 2023-12-09 17:11:44
tags:
- [GCP]
- [backend]
- [cloud]
- [api]
category:
- [GCP]
- [api]
index_img: ../image/banner/GCP_index.png
banner_img: ../image/banner/GCP_banner.jpg
---
範例的git 連結
[https://github.com/GoogleCloudPlatform/endpoints-quickstart](https://github.com/GoogleCloudPlatform/endpoints-quickstart)
sh 內容眾多部貼上來，可以進google 的範例git 參考
```shell
./deploy_api.sh
```
- deploy_api.sh內容
    ```shell
    set -euo pipefail
    
    source util.sh
    
    main() {
    # Get our working project, or exit if it's not set.
    local project_id=$(get_project_id)
    if [[ -z "$project_id" ]]; then
    exit 1
    fi
    local temp_file=$(mktemp)
    export TEMP_FILE="${temp_file}.yaml"
    mv "$temp_file" "$TEMP_FILE"
    # Because the included API is a template, we have to do some string
    # substitution before we can deploy it. Sed does this nicely.
    < "$API_FILE" sed -E "s/YOUR-PROJECT-ID/${project_id}/g" > "$TEMP_FILE"
    echo "Deploying $API_FILE..."
    echo "gcloud endpoints services deploy $API_FILE"
    gcloud endpoints services deploy "$TEMP_FILE"
    }
    
    cleanup() {
    rm "$TEMP_FILE"
    }
    
    # Defaults.
    API_FILE="../openapi.yaml"
    
    if [[ "$#" == 0 ]]; then
    : # Use defaults.
    elif [[ "$#" == 1 ]]; then
    API_FILE="$1"
    else
    echo "Wrong number of arguments specified."
    echo "Usage: deploy_api.sh [api-file]"
    exit 1
    fi
    
    # Cleanup our temporary files even if our deployment fails.
    trap cleanup EXIT
    
    main "$@"
    ```
- output
    ```text
  Service Configuration [2017-02-13-r2] uploaded for service [airports-api.endpoints.example-project.cloud.goog]
  ```
### 啟動api 後端
```shell
./deploy_app.sh
```
### 測試 request
```shell
./query_api.sh
```
```shell
./query_api.sh JFK
```
### 追蹤api 活動
```shell
./generate_traffic.sh
```
### 加上 api quota
```shell
./deploy_api.sh ../openapi_with_ratelimit.yaml
./deploy_app.sh
```
### api key
先進入Navigation menu > APIs & Services > Credentials.，創建api key
```shell
export API_KEY=YOUR-API-KEY
```
```shell
./query_api_with_key.sh $API_KEY
```
創建後測試
```shell
./generate_traffic_with_key.sh $API_KEY
```
```shell
./query_api_with_key.sh $API_KEY
```