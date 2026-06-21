<!--
SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
SPDX-License-Identifier: MIT
-->

# Free Sales Forecast 中文说明

[English](README.md)

Free Sales Forecast 是一个 free 的开源销售预测实验工作台，遵循 MIT
License。它面向跨市场、跨渠道销售团队，支持上传 CSV、对比预测模型、解释模型质量，并导出可用于采购、库存、投放和财务计划的预测结果。

## 用了什么模型

当前版本内置可部署的轻量模型 runner，不依赖重型 native 科学计算包：

- Prophet-like：趋势、变化点、季节性、节假日/活动特征。
- ETS：带 level、trend、damping 的指数平滑。
- SARIMA-like：季节基线 + 自回归残差修正。
- LightGBM/XGBoost-like：可解释的滞后、滚动、日历和活动特征模型。
- NeuralProphet-like：自回归、趋势、季节性和活动特征。
- N-BEATS-like：趋势块 + 季节残差块。
- Moving Average 和 Seasonal Naive 基线模型。

后续可以继续接入真实包版本的 Prophet、statsmodels SARIMA、LightGBM、
XGBoost、NeuralProphet 和 N-BEATS。当前模型依赖已经包含在后端镜像里，不需要 notebook 或额外脚本才能运行。

## 达到了什么效果

- 从 CSV 上传到持久化预测输出形成完整实验闭环。
- 在同一段历史数据上回测多个模型，并按验证集 WAPE 推荐模型。
- 输出历史拟合、未来预测，以及低位/推荐位/高位三条预测走势。
- 状态栏、模型建议卡片、表格高亮和下载按钮使用同一个推荐模型口径。
- PostgreSQL 保存数据集、任务、实验、模型指标和输出元数据。
- MinIO/S3 兼容对象存储保存上传 CSV 和模型输出文件。

## 有什么功能

- React/Vite 前端，使用语言包支持 English / 简体中文。
- FastAPI 后端，负责 CSV 上传、字段识别、数据诊断、任务创建、实验执行和 CSV 导出。
- Dramatiq worker + Redis，负责异步预测任务。
- PostgreSQL 元数据存储。
- MinIO/S3 兼容模型产物存储。
- Caddy 提供静态前端，并在容器启动时生成运行时 `config.js`。
- Docker Compose 本地完整部署。
- Kubernetes 清单，包含 frontend、backend、worker、Redis、PostgreSQL、
  MinIO 和 ingress。
- 用户菜单支持主题和语言切换。
- 指标、参数、图表 tooltip 解释。
- 按模型下载未来预测 CSV 和历史拟合 CSV。

## 本地运行

```bash
cp .env.example .env
docker compose up -d --build
```

打开：

- 应用：<http://localhost:8080>
- 后端 API 文档：<http://localhost:8000/docs>
- MinIO 控制台：<http://localhost:9001>

本地默认 MinIO 账号见 `.env.example`。

## Kubernetes

```bash
kubectl apply -k deploy/k8s
```

清单会把所有服务部署到 `free-sales-forecast` namespace。生产使用前请调整
`deploy/k8s/secret.example.yaml`、镜像名、存储类和 ingress host。

## License

Free Sales Forecast 是 free software，遵循 MIT License。详见
[LICENSE](LICENSE)。
