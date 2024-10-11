---
title: AWS AIF-C01 Responsible AI
date: 2024-10-11 11:05:42
tags:
- [aws]
- [ai]
category:
- [aws]
index_img: ../image/aws/aif_c01_index.png
banner_img: ../image/aws/aif_c01_banner.png
---

# Responsible AI  負責任的AI

## Bias-variance trade-offs

![variance_bias.png](..%2Fimage%2Fai%2Fvariance_bias.png)
### Variance 

. Variance refers to the model's sensitivity to fluctuations or noise in the training data. 模型對訓練數據中的波動或雜訊的敏感度。

![ai-bias.png](..%2Fimage%2Fai%2Fai-bias.png)
### underfitted 

underfitting the data because it is not capturing all the features of the data.模型擬合數據不足，因為它沒有捕獲數據的所有特徵

### overfitted 

capturing noise and is essentially memorizing the data. It won't perform well on new data. 在捕獲雜訊，本質上是在記憶數據。它對新數據的性能不佳

- 訓練時很強，實際上場很弱，Ben Simmons 型選手

### balanced 

the bias is low and the variance is low 偏差較低，方差較低。

## overcome bias and variance errors

### Cross-validation

by training several ML models on subsets of the available input data and evaluating them on the complementary subset of the data
在可用輸入數據的子集上訓練多個 ML 模型，然後在數據的互補子集上評估它們

### Increase Data

### Regularization

penalizes extreme weight values to help prevent linear models from overfitting

則化是一種懲罰極端權重值的方法，有助於防止線性模型過度擬合訓練數據示例。

### Simpler model

overfitting-> easier, 
underfitting-> harder

### dimension reduction
unsupervised machine learning algorithm that attempts to reduce the dimensionality (number of features)

無監督機器學習演算法，它試圖降低數據集中的維度（特徵數量）

### End training early


## Transparent and Explainable

Transparency answers the question HOW, and explainability answers the question WHY

透明度有助於瞭解模型如何做出決策, 可解釋性有助於理解模型做出決策的原因。

### Explainability frameworks 

- SHapley Value Added (SHAP)

- Local Interpretable Model-Agnostic Explanations (LIME),
help summarize and interpret the decisions made by AI systems 説明總結和解釋 AI 系統做出的決策

### Transparent Documentation

### Monitored and audited

oversight by humans and automated tools to identify unusual patterns or decisions.人工的定期測試和監督，以及識別異常模式或決策的自動化工具。

### human oversight and involvement

### counterfactual explanations

### user interfaces explanations 

## Tools for transparency and explainability

### AWS AI Service Cards

form of responsible AI documentation that provides customers with a single place to find information on the intended use cases and limitations

負責任的 AI 文件形式，它為客戶提供了一個位置來查找有關預期使用案例和限制、負責任的 AI 設計選擇

### SageMaker Model Cards 

risk rating of a model, training details and metrics, evaluation results and observations, and additional callouts such as considerations, recommendations, and custom information. 

預期用途和風險評級、訓練詳細資訊和指標、評估結果和觀察結果等資訊，以及其他標註，例如注意事項、建議和自定義資訊。

##  Tools for explainability

### SageMaker Clarify SageMaker 
help determine if a particular model input has more influence than expected on overall model behavior.

幫助確定特定模型輸入對整體模型行為的影響是否大於預期。

### SageMaker Autopilot SageMaker 

help ML engineers, product managers, and other internal stakeholders understand model characteristics.
幫助 ML 工程師、產品經理和其他內部利益相關者瞭解模型特徵


