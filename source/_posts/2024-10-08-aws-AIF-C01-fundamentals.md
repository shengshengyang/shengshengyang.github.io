---
title: AWS AIF-C01 機器學習基礎篇
date: 2024-10-08 15:42:54
tags:
- [aws]
- [ai]
category:
- [aws]
index_img: ../image/aws/aif_c01_index.png
banner_img: ../image/aws/aif_c01_banner.png
---
# Machine Learning Fundamentals <span class="label label-info">機器學習基礎知識</span>

## Training data <span class="label label-warning">訓練數據</span>

<p class="note note-danger">ML 模型的好壞取決於用於訓練它的數據。</p>

![Training data訓練數據](../image/data_training.png)

### Labeled data
is a dataset where each instance or example is accompanied by a <span class="label label-success">label</span> or <span class="label label-default">target</span> variable that represents the desired <span class="label label-info">output</span> or <span class="label label-primary">classification</span>.

標記數據是一個數據集，其中每個實例或示例都附有一個 <span class="label label-success">標籤</span> 或 <span class="label label-default">目標變數</span>，該變數表示所需的 <span class="label label-info">輸出</span> 或 <span class="label label-primary">分類</span>。

### Unlabeled data
instances or examples <span class="label label-danger">do not have any associated labels or target</span> variables. The data consists only of input features, without any corresponding output or classification.

未標記的數據是實例或示例 <span class="label label-danger">沒有任何關聯標籤或目標變數</span> 的數據集。數據僅包含輸入特徵，沒有任何相應的輸出或分類。

### Structured data

#### Tabular data(表格數據)
data stored in spreadsheets, databases, or CSV files, with rows representing instances and columns representing <span class="label label-info">features</span> or <span class="label label-success">attributes</span>.

存儲在電子表格、資料庫或 CSV 檔中的數據，其中 <span class="label label-info">行表示實例</span>，<span class="label label-success">列表示特徵或屬性</span>。

#### Time-series data(時間序列數據)
<span class="label label-warning">consists of sequences of values</span> measured at successive points in time, such as stock prices, sensor readings, or weather data.

<span class="label label-warning">連續時間點測量的值</span>序列組成，例如股票價格、感測器讀數或天氣數據。

## Machine learning process <span class="label label-info">機器學習過程</span>

![Training data 機器學習過程](../image/machine_learning_process.png)
traditionally divided into three broad categories: supervised learning, unsupervised learning, and reinforcement learning.

### Supervised learning(監督式學習)
trained on <span class="label label-success">labeled data</span>, learn a mapping function that can <span class="label label-primary">predict the output for new, unseen input data</span>
在<span class="label label-success">標記數據</span>上訓練的。目標是學習一個映射函數，該函數可以<span class="label label-primary">預測新的、看不見的輸入數據的輸出</span>。

#### Types of supervised ML

- **Classification(分類)**: assign labels or categories to new 
- **Regression(回歸)**: predicting continuous or numerical values based on one or more input variable

### Unsupervised learning(無監督學習)
learn from <span class="label label-warning">unlabeled 
data</span>, discover inherent patterns, structures, or relationships within the input data

從<span class="label label-warning">未標記數據</span>中學習的演算法, 目標是發現輸入數據中的固有模式、結構或關係

#### Types of Unsupervised learning

- **clustering(聚類)**: roups data into different clusters based on similar features or distances
- **Dimensionality reduction(降維)**: reduce the number of features or dimensions

### Reinforcement learning(強化學習)

machine is given only a performance score as guidance and semi-supervised learning, <span class="label label-success">Feedback is provided in the form of rewards or penalties</span> for its actions, improve its decision-making over time

機器只得到一個性能分數作為指導,<span class="label label-success">反饋以獎勵或懲罰的形式</span>提供,機器從這些反饋中學習, 隨時間的推移改進其決策。

## Inferencing (推理)

After the model has been trained, it is time to begin the process of using the information that a model has learned to make predictions or decisions. This is called inferencing.
使用模型學到的信息進行預測或決策, 稱為推理。

### Batch inferencing(批量推理)
the computer takes a large amount of data, <span class="label label-warning">analyzes it all at once</span> to provide a set of results 獲取大量數據, 並<span class="label label-warning">一次對其進行分析</span>以提供一組結果

### Real-time inferencing (即時推理)
make decisions quickly, <span class="label label-success">in response to new information</span>, such as in chatbots or self-driving cars. 快速做出決策，以<span class="label label-success">回應傳入的新資訊</span>, 例如聊天機器人或自動駕駛汽車。