/*
 * SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
 * SPDX-License-Identifier: MIT
 */
import { AutoAvatar } from "./vendor/open-avatar.js";

const i18nBridge = () => window.FreeSalesForecastI18n || {};
const runtimeConfig = () => i18nBridge().config || window.FREE_SALES_FORECAST_CONFIG || {};
const t = (key, options = {}) => i18nBridge().t?.(key, options) ?? options.defaultValue ?? key;
const currentLocale = () => i18nBridge().i18n?.language || "en-US";
const lt = (zh, en) => (currentLocale() === "zh-CN" ? zh : en);
const modelName = (modelId) => i18nBridge().modelName?.(modelId) || fallbackModelName(modelId);
const STORAGE_KEYS = {
  theme: "freeSalesForecastTheme",
  palette: "freeSalesForecastPalette",
  avatar: "freeSalesForecastAvatar",
  sidebarCollapsed: "freeSalesForecastSidebarCollapsed",
};

function storedValue(newKey, fallback) {
  const value = localStorage.getItem(newKey) || fallback;
  if (value && !localStorage.getItem(newKey)) localStorage.setItem(newKey, value);
  return value;
}

function fallbackModelName(modelId) {
  if (modelId === "ets") return "ETS";
  if (modelId === "sarima") return "SARIMA-like";
  if (modelId === "featureMl") return "LightGBM/XGBoost-like";
  if (modelId === "neuralProphet") return "NeuralProphet-like";
  if (modelId === "nbeats") return "N-BEATS-like";
  if (modelId === "movingAverage") return "Moving Average";
  if (modelId === "seasonalNaive") return "Seasonal Naive";
  return "Prophet-like";
}

const sampleCsv = `date,sales,channel,category
2023-01-01,84210,All,Total
2023-02-01,76540,All,Total
2023-03-01,91880,All,Total
2023-04-01,94320,All,Total
2023-05-01,101540,All,Total
2023-06-01,128460,All,Total
2023-07-01,112300,All,Total
2023-08-01,108920,All,Total
2023-09-01,118870,All,Total
2023-10-01,136540,All,Total
2023-11-01,168880,All,Total
2023-12-01,193420,All,Total
2024-01-01,98200,All,Total
2024-02-01,86150,All,Total
2024-03-01,105240,All,Total
2024-04-01,109700,All,Total
2024-05-01,118340,All,Total
2024-06-01,151650,All,Total
2024-07-01,130980,All,Total
2024-08-01,127410,All,Total
2024-09-01,139760,All,Total
2024-10-01,157850,All,Total
2024-11-01,201460,All,Total
2024-12-01,229900,All,Total
2025-01-01,117520,All,Total
2025-02-01,104210,All,Total
2025-03-01,126880,All,Total
2025-04-01,132640,All,Total
2025-05-01,144300,All,Total
2025-06-01,181550,All,Total
2025-07-01,156770,All,Total
2025-08-01,153820,All,Total
2025-09-01,168940,All,Total
2025-10-01,190230,All,Total
2025-11-01,239880,All,Total
2025-12-01,274660,All,Total`;

const els = {
  csvFile: document.querySelector("#csvFile"),
  loadSampleBtn: document.querySelector("#loadSampleBtn"),
  downloadTemplateBtn: document.querySelector("#downloadTemplateBtn"),
  dateColumn: document.querySelector("#dateColumn"),
  valueColumn: document.querySelector("#valueColumn"),
  forecastModel: document.querySelector("#forecastModel"),
  groupColumn: document.querySelector("#groupColumn"),
  groupFilter: document.querySelector("#groupFilter"),
  growth: document.querySelector("#growth"),
  horizon: document.querySelector("#horizon"),
  forecastCadenceUnit: document.querySelector("#forecastCadenceUnit"),
  forecastStep: document.querySelector("#forecastStep"),
  changepoints: document.querySelector("#changepoints"),
  changepointsValue: document.querySelector("#changepointsValue"),
  changepointRange: document.querySelector("#changepointRange"),
  changepointPriorScale: document.querySelector("#changepointPriorScale"),
  changepointPriorScaleValue: document.querySelector("#changepointPriorScaleValue"),
  cap: document.querySelector("#cap"),
  floor: document.querySelector("#floor"),
  seasonalityMode: document.querySelector("#seasonalityMode"),
  seasonalityPriorScale: document.querySelector("#seasonalityPriorScale"),
  intervalWidth: document.querySelector("#intervalWidth"),
  uncertaintySamples: document.querySelector("#uncertaintySamples"),
  weekly: document.querySelector("#weekly"),
  weeklyOrder: document.querySelector("#weeklyOrder"),
  monthly: document.querySelector("#monthly"),
  monthlyOrder: document.querySelector("#monthlyOrder"),
  quarterly: document.querySelector("#quarterly"),
  quarterlyOrder: document.querySelector("#quarterlyOrder"),
  yearly: document.querySelector("#yearly"),
  yearlyOrder: document.querySelector("#yearlyOrder"),
  clipZero: document.querySelector("#clipZero"),
  holidayCountry: document.querySelector("#holidayCountry"),
  holidayPriorScale: document.querySelector("#holidayPriorScale"),
  holidayLowerWindow: document.querySelector("#holidayLowerWindow"),
  holidayUpperWindow: document.querySelector("#holidayUpperWindow"),
  etsAuto: document.querySelector("#etsAuto"),
  etsAlpha: document.querySelector("#etsAlpha"),
  etsBeta: document.querySelector("#etsBeta"),
  etsPhi: document.querySelector("#etsPhi"),
  sarimaLag: document.querySelector("#sarimaLag"),
  sarimaAr: document.querySelector("#sarimaAr"),
  featureLag: document.querySelector("#featureLag"),
  featureRolling: document.querySelector("#featureRolling"),
  featureEvents: document.querySelector("#featureEvents"),
  neuralLag: document.querySelector("#neuralLag"),
  neuralSeasonWeight: document.querySelector("#neuralSeasonWeight"),
  neuralEvents: document.querySelector("#neuralEvents"),
  nbeatsTrendDegree: document.querySelector("#nbeatsTrendDegree"),
  nbeatsSeasonLag: document.querySelector("#nbeatsSeasonLag"),
  movingAverageWindow: document.querySelector("#movingAverageWindow"),
  seasonalNaiveLag: document.querySelector("#seasonalNaiveLag"),
  eventDates: document.querySelector("#eventDates"),
  runBtn: document.querySelector("#runBtn"),
  sidebarCollapseBtn: document.querySelector("#sidebarCollapseBtn"),
  sidebarCollapseIcon: document.querySelector("#sidebarCollapseIcon"),
  sidebarCollapseLabel: document.querySelector("#sidebarCollapseLabel"),
  status: document.querySelector("#status"),
  statusText: document.querySelector("#statusText"),
  userMenuBtn: document.querySelector("#userMenuBtn"),
  userMenu: document.querySelector("#userMenu"),
  avatarImages: document.querySelectorAll(".open-avatar-img"),
  avatarHashLabel: document.querySelector("#avatarHashLabel"),
  chart: document.querySelector("#chart"),
  chartSubtitle: document.querySelector("#chartSubtitle"),
  downloadBtn: document.querySelector("#downloadBtn"),
  clearExperimentsBtn: document.querySelector("#clearExperimentsBtn"),
  metricRows: document.querySelector("#metricRows"),
  metricAvg: document.querySelector("#metricAvg"),
  metricForecast: document.querySelector("#metricForecast"),
  metricMape: document.querySelector("#metricMape"),
  modelNotes: document.querySelector("#modelNotes"),
  processingAudit: document.querySelector("#processingAudit"),
  modelComparisonCaption: document.querySelector("#modelComparisonCaption"),
  modelComparison: document.querySelector("#modelComparison"),
  forecastSummaryCaption: document.querySelector("#forecastSummaryCaption"),
  forecastSummary: document.querySelector("#forecastSummary"),
  marketGuide: document.querySelector("#marketGuide"),
  holidayTemplatePreview: document.querySelector("#holidayTemplatePreview"),
  holidayDatePreview: document.querySelector("#holidayDatePreview"),
  forecastTableCaption: document.querySelector("#forecastTableCaption"),
  forecastRows: document.querySelector("#forecastRows"),
  experimentRows: document.querySelector("#experimentRows"),
};

const staticBindings = [
  ["#runBtn", "ui.runForecast"],
  ["#loadSampleBtn", "ui.loadSample"],
  ['.tab-btn[data-tab="data"]', "ui.data"],
  ['.tab-btn[data-tab="trend"]', "ui.trend"],
  ['.tab-btn[data-tab="season"]', "ui.season"],
  ['.tab-btn[data-tab="holiday"]', "ui.holiday"],
  ['.tab-btn[data-tab="output"]', "ui.output"],
  [".brand h1", "common.appName"],
  [".brand p", "ui.subtitle"],
  [".workspace .eyebrow", "common.appName"],
  [".workspace h2", "ui.resultWorkbench"],
  [".status-label", "ui.status"],
  ['[data-menu-action="profile"]', "ui.profile"],
  ['[data-menu-action="logout"]', "ui.logout"],
  [".workflow-strip span:nth-child(1)", "ui.workflow1", "1"],
  [".workflow-strip span:nth-child(2)", "ui.workflow2", "2"],
  [".workflow-strip span:nth-child(3)", "ui.workflow3", "3"],
  [".workflow-strip span:nth-child(4)", "ui.workflow4", "4"],
  [".metrics article:nth-child(1) > span", "ui.validHistory"],
  [".metrics article:nth-child(2) > span", "ui.historicalAvg"],
  [".metrics article:nth-child(3) > span", "ui.primaryTotal"],
  [".metrics article:nth-child(4) > span", "ui.primaryMape"],
  [".model-lab h3", "ui.modelComparisonTitle"],
  [".chart-area h3", "ui.chartTitle"],
  ["#downloadBtn", "ui.downloadPrimaryCsv"],
  [".insight-grid .insight-panel:nth-child(1) h3", "ui.forecastSummaryTitle"],
  [".insight-grid .insight-panel:nth-child(2) h3", "ui.marketStrategyTitle"],
  [".insight-grid .insight-panel:nth-child(2) .section-heading p", "ui.marketStrategyCaption"],
  [".audit-panel h3", "ui.auditTitle"],
  [".audit-panel .section-heading p", "ui.auditCaption"],
  [".lower-grid .table-panel:nth-child(1) h3", "ui.forecastDetailTitle"],
  [".lower-grid .table-panel:nth-child(2) h3", "ui.experimentTitle"],
  [".lower-grid .table-panel:nth-child(2) .section-heading p", "ui.experimentCaption"],
  ["#clearExperimentsBtn", "ui.clear"],
  [".lower-grid .table-panel:nth-child(1) thead th:nth-child(2)", "table.date"],
  [".lower-grid .table-panel:nth-child(1) thead th:nth-child(3)", "table.distance"],
  [".lower-grid .table-panel:nth-child(1) thead th:nth-child(4)", "table.low"],
  [".lower-grid .table-panel:nth-child(1) thead th:nth-child(5)", "table.recommended"],
  [".lower-grid .table-panel:nth-child(1) thead th:nth-child(6)", "table.high"],
  [".lower-grid .table-panel:nth-child(1) thead th:nth-child(7)", "table.events"],
  [".lower-grid .table-panel:nth-child(2) thead th:nth-child(2)", "table.model"],
  [".lower-grid .table-panel:nth-child(2) thead th:nth-child(3)", "table.periods"],
  [".lower-grid .table-panel:nth-child(2) thead th:nth-child(4)", "table.keyParams"],
];

const staticTextBindings = [
  [".data-template-box .mini-heading > span:first-child", "static.dataTemplateTitle"],
  [".data-template-box .template-fields span:nth-child(1) strong", "static.templateRequired"],
  [".data-template-box .template-fields span:nth-child(2) strong", "static.templateMetric"],
  [".data-template-box .template-fields span:nth-child(3) strong", "static.templatePrice"],
  [".data-template-box .template-fields span:nth-child(4) strong", "static.templateMarket"],
  [".data-template-box .template-fields span:nth-child(5) strong", "static.templateDimension"],
  [".data-template-box .template-fields span:nth-child(6) strong", "static.templateEvent"],
  ["#downloadTemplateBtn", "static.downloadTemplate"],
  [".file-drop span", "static.chooseCsv"],
  [".file-drop small", "static.csvRequirement"],
  ['[data-panel="data"] .group-title span', "static.dataPanelTitle"],
  ['[data-panel="trend"] .group-title span', "static.trendPanelTitle"],
  ['[data-panel="season"] .group-title span', "static.seasonPanelTitle"],
  ['[data-panel="holiday"] .group-title span', "static.holidayPanelTitle"],
  ['[data-panel="output"] .group-title span', "static.outputPanelTitle"],
  ['[data-model-panel="ets"] .mini-heading > span:first-child', "static.etsTitle"],
  ['[data-model-panel="movingAverage"] .mini-heading > span:first-child', "static.movingAverageTitle"],
  ['[data-model-panel="sarima"] .mini-heading > span:first-child', "static.sarimaTitle"],
  ['[data-model-panel="featureMl"] .mini-heading > span:first-child', "static.featureMlTitle"],
  ['[data-model-panel="neuralProphet"] .mini-heading > span:first-child', "static.neuralProphetTitle"],
  ['[data-model-panel="nbeats"] .mini-heading > span:first-child', "static.nbeatsTitle"],
  ['[data-model-panel="seasonalNaive"] .mini-heading > span:first-child', "static.seasonalNaiveTitle"],
  [".season-guide .mini-heading > span:first-child", "static.seasonGuideTitle"],
  [".season-guide .guide-list span:nth-child(1) strong", "static.weekly"],
  [".season-guide .guide-list span:nth-child(2) strong", "static.monthly"],
  [".season-guide .guide-list span:nth-child(3) strong", "static.quarterly"],
  [".season-guide .guide-list span:nth-child(4) strong", "static.yearly"],
  [".season-guide .guide-list span:nth-child(5) strong", "static.prior"],
  [".season-guide .guide-list span:nth-child(6) strong", "static.mode"],
  [".season-guide .guide-list span:nth-child(1)", "static.weeklyGuide"],
  [".season-guide .guide-list span:nth-child(2)", "static.monthlyGuide"],
  [".season-guide .guide-list span:nth-child(3)", "static.quarterlyGuide"],
  [".season-guide .guide-list span:nth-child(4)", "static.yearlyGuide"],
  [".season-guide .guide-list span:nth-child(5)", "static.priorGuide"],
  [".season-guide .guide-list span:nth-child(6)", "static.modeGuide"],
  [".holiday-template-box .mini-heading > span:first-child", "static.holidayTemplateTitle"],
  [".insight-grid .insight-panel:nth-child(2) .section-heading p", "ui.marketStrategyCaption"],
  [".audit-panel .section-heading p", "ui.auditCaption"],
  ["#forecastTableCaption", "static.forecastTableCaption"],
  ["#modelComparisonCaption", "static.modelComparisonWaiting"],
  ["#chartSubtitle", "static.chartStart"],
  ["#forecastSummaryCaption", "static.forecastSummaryWaiting"],
];

const controlLabelBindings = [
  ["dateColumn", "controls.dateColumn"],
  ["valueColumn", "controls.valueColumn"],
  ["forecastModel", "controls.forecastModel"],
  ["groupColumn", "controls.groupColumn"],
  ["groupFilter", "controls.groupFilter"],
  ["etsAuto", "controls.etsAuto"],
  ["etsAlpha", "controls.etsAlpha"],
  ["etsBeta", "controls.etsBeta"],
  ["etsPhi", "controls.etsPhi"],
  ["movingAverageWindow", "controls.movingAverageWindow"],
  ["sarimaLag", "controls.sarimaLag"],
  ["sarimaAr", "controls.sarimaAr"],
  ["featureLag", "controls.featureLag"],
  ["featureRolling", "controls.featureRolling"],
  ["featureEvents", "controls.featureEvents"],
  ["neuralLag", "controls.neuralLag"],
  ["neuralSeasonWeight", "controls.neuralSeasonWeight"],
  ["neuralEvents", "controls.neuralEvents"],
  ["nbeatsTrendDegree", "controls.nbeatsTrendDegree"],
  ["nbeatsSeasonLag", "controls.nbeatsSeasonLag"],
  ["seasonalNaiveLag", "controls.seasonalNaiveLag"],
  ["growth", "controls.growth"],
  ["changepointRange", "controls.changepointRange"],
  ["changepoints", "controls.changepoints"],
  ["changepointPriorScale", "controls.changepointPriorScale"],
  ["cap", "controls.cap"],
  ["floor", "controls.floor"],
  ["clipZero", "controls.clipZero"],
  ["seasonalityMode", "controls.seasonalityMode"],
  ["seasonalityPriorScale", "controls.seasonalityPriorScale"],
  ["weekly", "controls.weekly"],
  ["monthly", "controls.monthly"],
  ["quarterly", "controls.quarterly"],
  ["yearly", "controls.yearly"],
  ["holidayCountry", "controls.holidayCountry"],
  ["holidayPriorScale", "controls.holidayPriorScale"],
  ["holidayLowerWindow", "controls.holidayLowerWindow"],
  ["holidayUpperWindow", "controls.holidayUpperWindow"],
  ["eventDates", "controls.eventDates"],
  ["horizon", "controls.horizon"],
  ["forecastCadenceUnit", "controls.forecastCadenceUnit"],
  ["forecastStep", "controls.forecastStep"],
  ["intervalWidth", "controls.intervalWidth"],
  ["uncertaintySamples", "controls.uncertaintySamples"],
];

const selectOptionBindings = {
  forecastModel: {
    prophet: "options.forecastModel.prophet",
    ets: "options.forecastModel.ets",
    sarima: "options.forecastModel.sarima",
    featureMl: "options.forecastModel.featureMl",
    neuralProphet: "options.forecastModel.neuralProphet",
    nbeats: "options.forecastModel.nbeats",
    movingAverage: "options.forecastModel.movingAverage",
    seasonalNaive: "options.forecastModel.seasonalNaive",
  },
  holidayCountry: {
    none: "options.holidayCountry.none",
    CN: "options.holidayCountry.CN",
    US: "options.holidayCountry.US",
    CA: "options.holidayCountry.CA",
    MX: "options.holidayCountry.MX",
    NAM: "options.holidayCountry.NAM",
    EU: "options.holidayCountry.EU",
    UK: "options.holidayCountry.UK",
    SEA: "options.holidayCountry.SEA",
    GLOBAL: "options.holidayCountry.GLOBAL",
  },
  forecastCadenceUnit: {
    auto: "options.forecastCadenceUnit.auto",
    day: "options.forecastCadenceUnit.day",
    week: "options.forecastCadenceUnit.week",
    month: "options.forecastCadenceUnit.month",
  },
};

const helpTipTranslations = {
  "按这个模板从 ERP、订单系统或 BI 导出数据，模型可同时识别销量、收益、客单价、区域、渠道、品类和活动影响。最少需要 date + 一个可预测指标；数据越完整，诊断和区域预测越可靠。": "Export data from ERP, order systems, or BI in this shape. The model can recognize units, revenue, AOV, region, channel, category, and event effects. At minimum, provide date plus one forecastable metric.",
  "选择你要预测的业务指标，可以是销量、销售额、订单数或收益。系统会做只读诊断，尽量判断当前数据更适合预测销量、收益还是客单价。": "Choose the business metric to forecast: units, sales amount, order count, or revenue. The system performs read-only diagnosis to judge whether the data fits units, revenue, or AOV.",
  "主预测模型决定趋势图里的高位、推荐位、低位和主预测明细。右侧模型实验台仍会并行回测全部模型，并给出推荐模型；主模型和推荐模型可能不同。": "The primary model drives high/recommended/low chart lines and detail rows. The model lab still backtests all models and recommends one; primary and recommended models can differ.",
  "ETS 用 level、trend 和 damping 预测。适合短历史、稳定增长、无复杂活动解释的数据。auto 会在一组候选参数中自动选择历史误差较小的组合。": "ETS forecasts with level, trend, and damping. It fits short histories and stable growth. Auto chooses lower-error alpha/beta/phi from a candidate grid.",
  "水平平滑系数。越大越重视最近一期；越小越平滑。常见范围 0.2 到 0.8。": "Level smoothing coefficient. Larger values emphasize the latest period; smaller values smooth more. Common range: 0.2 to 0.8.",
  "趋势平滑系数。越大趋势变化越灵敏；越小趋势更稳定。常见范围 0.05 到 0.35。": "Trend smoothing coefficient. Larger values react faster to trend changes; smaller values are more stable. Common range: 0.05 to 0.35.",
  "趋势阻尼系数。1 表示不阻尼；小于 1 表示长期趋势逐步收敛，适合避免无限外推。": "Trend damping coefficient. 1 means no damping; below 1 makes long-term trend converge and avoids unlimited extrapolation.",
  "移动平均用最近 N 期平均值作为下一期预测。它是稳健基线，适合短期平稳数据，但无法主动学习趋势和节假日冲击。": "Moving average uses the latest N-period average as the next forecast. It is a robust baseline, but does not learn trend or holiday shocks.",
  "计算最近多少期的平均值。窗口越小越灵敏，窗口越大越平滑。填 0 表示按数据频率自动选择。": "How many recent periods to average. Smaller windows react faster; larger windows smooth more. Use 0 to auto-select by frequency.",
  "浏览器版使用“季节基线 + AR 残差”的轻量近似，用来模拟 SARIMA 的周期回归能力。真正 SARIMA/SARIMAX 建议后续接 Python statsmodels。": "The browser version approximates SARIMA with a seasonal baseline plus AR residual correction. Real SARIMA/SARIMAX should use Python statsmodels later.",
  "复制多少期之前的季节值作为基线。填 0 表示自动：月度优先 12，日度优先 7，周度优先 4。": "How many periods back to copy as the seasonal baseline. Use 0 for auto: 12 monthly, 7 daily, 4 weekly when appropriate.",
  "残差自回归项的保留比例。越高，近期高估或低估会延续更久；越低，更接近纯季节复用。": "Autoregressive residual retention. Higher values carry recent over/under-estimation longer; lower values behave closer to pure seasonal reuse.",
  "浏览器版先用可解释特征模型近似树模型思路：滞后销量、滚动均值、趋势、月份和活动特征。真实 LightGBM/XGBoost 适合后续接 Python 后端训练。": "The browser version approximates tree models with interpretable lag, rolling, trend, calendar, and event features. Real LightGBM/XGBoost should run in Python backend training.",
  "把 N 期前的销量作为机器学习特征。月度数据常用 12，日度数据常用 7。填 0 表示自动。": "Use sales from N periods ago as a feature. Monthly data often uses 12; daily data often uses 7. Use 0 for auto.",
  "计算最近 N 期均值作为稳定特征。窗口越小越灵敏，窗口越大越平滑。": "Use the latest N-period average as a stable feature. Smaller windows react faster; larger windows smooth more.",
  "启用后，目标市场模板和自定义活动会作为机器学习特征参与预测，适合多区域销售数据。": "When enabled, target-market templates and custom events are used as ML features for multi-region sales data.",
  "浏览器版用“自回归 + 趋势 + 季节 + 活动特征”的可解释近似来模拟 NeuralProphet 的思路。真实 NeuralProphet 需要 Python 后端训练。": "The browser version approximates NeuralProphet with autoregression, trend, seasonality, and event features. Real NeuralProphet requires Python backend training.",
  "使用最近多少期历史作为自回归信号。值越大，模型越重视近期走势记忆；历史短时不要过大。": "How many recent periods to use as autoregressive signal. Larger values emphasize recent memory; avoid large values with short histories.",
  "控制周期特征在预测中的权重。值越大越重视月度/年度等周期，值越小更依赖近期自回归。": "Controls the weight of periodic features. Larger values emphasize monthly/yearly cycles; smaller values rely more on recent autoregression.",
  "启用后，区域节假日和自定义活动会作为外部特征参与预测。": "When enabled, regional holidays and custom events are used as external forecast features.",
  "浏览器版用趋势块 + 季节块的可解释近似来模拟 N-BEATS 分解思想。真实 N-BEATS 属于深度学习模型，后续更适合接 Python/PyTorch 后端。": "The browser version approximates N-BEATS with interpretable trend and seasonal blocks. Real N-BEATS is better suited to Python/PyTorch backend execution.",
  "趋势块使用几阶多项式。1 表示线性趋势，2/3 可以表达加速或减速，但短历史更容易过拟合。": "Polynomial degree for the trend block. 1 is linear; 2/3 can express acceleration or deceleration, but short histories overfit more easily.",
  "季节块复用多少期之前的残差周期。填 0 表示自动：月度优先 12，日度优先 7，周度优先 4。": "How many periods back the seasonal block reuses residual cycles. Use 0 for auto: 12 monthly, 7 daily, 4 weekly when appropriate.",
  "季节朴素模型直接复用上一个周期的值。适合稳定周/月/年周期，也是判断复杂模型是否有价值的强基线。": "Seasonal Naive reuses the previous cycle. It fits stable weekly/monthly/yearly cycles and is a strong baseline for judging complex models.",
  "未来值复制多少期之前的历史值。填 0 表示自动：月度优先 12，日度优先 7，周度优先 4。": "How many periods back future values copy from. Use 0 for auto: 12 monthly, 7 daily, 4 weekly when appropriate.",
  "名词解释：趋势如何随时间增长。linear 表示线性趋势；flat 表示不学习长期趋势；logistic 表示有上限 cap 的 S 型增长。计算方法：linear 使用时间 t 和变化点特征；logistic 会把销售额转换为 logit((y-floor)/(cap-floor)) 后拟合。": "Meaning: how trend grows. linear is linear; flat does not learn long-term trend; logistic is S-shaped growth with cap. Calculation: logistic fits logit((y-floor)/(cap-floor)).",
  "名词解释：允许模型在哪段历史里寻找趋势变化点。计算方法：changepoint_range * 历史总长度，默认 0.8 表示只在前 80% 历史中布置变化点，减少末尾过拟合。": "Meaning: which part of history can contain changepoints. Calculation: changepoint_range times history length; default 0.8 avoids fitting end noise.",
  "名词解释：趋势可转折的候选点数量。计算方法：模型为每个变化点添加 max(0, t - cp) 特征。数量越多越能贴合突变，但越容易把噪声当趋势。": "Meaning: number of candidate trend turning points. Calculation: each changepoint adds max(0, t - cp). More points fit shocks but can treat noise as trend.",
  "名词解释：趋势变化的自由度。计算方法：它控制变化点特征的正则惩罚，值越大惩罚越小，趋势越灵活，更容易贴合突增突降；值越小趋势越平滑，更不容易被短期噪声带偏。新手建议从 0.05 到 0.5 做实验。": "Meaning: trend flexibility. It controls regularization on changepoint features. Larger values fit shocks more; smaller values smooth more. Try 0.05 to 0.5 first.",
  "名词解释：逻辑增长的销售上限。计算方法：logistic 模式下使用 cap 和 floor 把销售额压到 0 到 1 之间再拟合。适合容量、门店数、市场规模有上限的业务。": "Meaning: sales upper bound for logistic growth. cap and floor scale sales into 0..1 before fitting. Useful when capacity or market size has an upper bound.",
  "名词解释：销售额下限。计算方法：logistic 模式和最终裁剪都会参考 floor；通常销售额业务设为 0。": "Meaning: sales lower bound. logistic mode and final clipping use floor. For sales forecasting, this is usually 0.",
  "名词解释：销售额的业务下限约束。计算方法：模型内部仍可用线性项拟合，但展示出的历史拟合、未来推荐位、低位和高位都会按 max(预测值, floor, 0) 裁剪，避免出现负销量。": "Meaning: business lower-bound constraint. Displayed fitted and forecast values are clipped by max(prediction, floor, 0) to avoid negative sales.",
  "名词解释：季节波动与趋势的组合方式。additive 表示 y = 趋势 + 季节；multiplicative 表示季节按比例放大，适合销售额越大、季节波动绝对值也越大的业务。": "Meaning: how seasonality combines with trend. additive means y = trend + seasonality; multiplicative scales seasonality with trend size.",
  "名词解释：季节项强度。计算方法：控制傅里叶季节特征的正则惩罚，值越大越贴合周、月、季度、年这些周期波动；值越小周期越平滑。波动稳定且历史足够长可以调大，历史短或周期不稳定应调小。": "Meaning: seasonality strength. It controls regularization of Fourier features. Larger values follow cycles more; smaller values smooth cycles.",
  "季节性用于解释稳定重复的周期，不用于解释一次性大促。先开与你数据频率匹配的周期，再逐步调高 Fourier 阶数和季节强度 season_prior。": "Seasonality explains stable repeated cycles, not one-time campaigns. Enable cycles matching data frequency, then gradually raise Fourier order and season_prior.",
  "名词解释：自动注入对应区域的节假日和零售活动。支持中国、美国、加拿大、墨西哥、北美组合、欧洲、英国、东南亚。计算方法：这些日期会变成节假日特征参与拟合；欧洲/东南亚是跨国零售模板，不是单一官方日历。": "Meaning: automatically inject regional holidays and retail events. Supports China, US, Canada, Mexico, North America, Europe, UK, and SEA. Europe/SEA are retail templates, not official single-country calendars.",
  "名词解释：节假日/活动影响强度。计算方法：控制节假日特征的正则惩罚。值越大，模型越愿意把异常峰谷归因给活动；值越小，活动影响越保守。数据少、活动不稳定或区域混合时建议保守。": "Meaning: holiday/event strength. It controls regularization for holiday features. Larger values explain peaks/dips as events more readily; smaller values are conservative.",
  "名词解释：活动日前多少天开始影响销售。计算方法：若日期距离活动日在 lower_window 到 upper_window 之间，节假日特征取 1。预售型活动可设为 -7、-14。": "Meaning: how many days before an event impact begins. Holiday feature is 1 when date distance is between lower_window and upper_window. Presale events may use -7 or -14.",
  "名词解释：活动日后多少天仍影响销售。计算方法：若日期距离活动日在 lower_window 到 upper_window 之间，节假日特征取 1。节后延迟履约或返场促销可适当调大。": "Meaning: how many days after an event impact remains. Increase for post-event fulfillment delay or rerun campaigns.",
  "这里列出目标市场模板已经自动加入模型的节日、促销和区域零售节点。自定义活动只需要补这里没有的内容，例如平台活动、品牌日、会员日、省州假日、当地长周末、财年节点、物流截单日。": "Lists holidays, campaigns, and retail moments already added by the market template. Custom events only need to add missing items like platform campaigns, brand days, local holidays, fiscal nodes, or shipping cutoffs.",
  "填写格式：每行或分号分隔一个活动，日期和名称用逗号分隔，例如 2026-06-18,618 加码日。计算方法：自定义活动会和内置模板合并，并受 lower_window、upper_window、活动强度 holiday_prior 控制。": "Format: one event per line or separated by semicolons. Separate date and name with a comma, e.g. 2026-06-18,618 Boost Day. Custom events merge with built-ins and use the holiday window settings.",
  "名词解释：向未来预测多少个时间步。计算方法：模型自动识别历史频率；月度数据预测 30 表示未来 30 个月，日度数据预测 30 表示未来 30 天。": "Meaning: how many future time steps to forecast. Monthly data with 30 means 30 months; daily data with 30 means 30 days.",
  "名词解释：未来结果每一期之间隔多久。自动表示沿用历史数据频率；手动可改成按天、按周或按月输出。模型仍使用历史频率学习，步长只控制未来日期和结果展示。": "Meaning: interval between future output periods. Auto follows historical frequency; manual mode can output daily, weekly, or monthly. It controls future dates and display.",
  "计算方法：预测步长 = 间隔数 × 单位。例如单位选“按周”、间隔数为 2，就是每 2 周输出一期。自动识别时此值不生效。": "Calculation: cadence = interval count times unit. Weekly with interval 2 outputs every 2 weeks. Ignored in auto mode.",
  "名词解释：预测不确定性的覆盖范围。计算方法：根据历史拟合残差标准差估计上下界；90% 区间约使用 1.645 倍残差标准差。": "Meaning: forecast uncertainty coverage. Bounds are estimated from historical residual standard deviation; 90% uses about 1.645 times residual standard deviation.",
  "名词解释：Prophet 中用于估计不确定性的采样数。当前浏览器版用解析残差区间，不真正采样；保留该参数用于教学和后续接入真实 Prophet。": "Meaning: Prophet uncertainty sample count. The browser version uses analytic residual intervals, not real sampling; the parameter is kept for learning and future Prophet integration.",
  "名词解释：用于训练模型的有效时间点数量。计算方法：CSV 导入后，按日期列聚合预测指标列，过滤无效日期和非数字值后的记录数。": "Meaning: valid time points used for training. After CSV import, metric values are aggregated by date and invalid dates/non-numeric values are filtered.",
  "名词解释：历史期的平均指标值，用来判断预测是否明显偏高或偏低。计算方法：sum(历史指标值) / 历史记录数。": "Meaning: average historical metric value, used to judge whether forecast is too high or low. Calculation: sum(history metric) / history count.",
  "名词解释：未来预测窗口内主模型推荐位合计。计算方法：sum(每一期推荐位)。推荐位是主模型中心预测，适合作为默认目标、预算和计划基线。": "Meaning: total primary-model recommended value over the forecast window. Calculation: sum(recommended value per period). Useful as baseline target, budget, or plan.",
  "名词解释：主模型在全部历史点上的平均绝对百分比误差，越低代表历史拟合越贴近真实值。计算方法：mean(abs(实际值 - 拟合值) / 实际值) * 100%。注意：实际值接近 0 时 MAPE 会被放大。": "Meaning: primary model MAPE on history. Lower means fit is closer to actuals. Calculation: mean(abs(actual - fitted) / actual) * 100%. MAPE is amplified when actuals are near zero.",
  "用同一段历史回测窗口比较多个模型。MAE 是平均绝对误差；RMSE 更惩罚大错；MAPE 是平均百分比误差；WAPE 是总体绝对误差 / 总体实际值，更适合销售规模口径。这里给出推荐模型，但不会自动替换左侧主模型。": "Compares models on the same backtest window. MAE is mean absolute error; RMSE penalizes large errors; MAPE is mean percentage error; WAPE is total absolute error divided by total actual value. Recommendation does not automatically replace the primary model.",
  "预测区有三条业务走势：红色高位、金色推荐位、绿色低位。浅色实线是历史拟合对比，虚线是未来模型对比。鼠标移到图上可以查看日期、预测期数、三种数量和命中的节假日活动。": "The forecast area has three curves: red high, gold recommended, and green low. Light solid lines compare historical fits; dashed lines compare future forecasts. Hover to see date, period, values, and matched events.",
  "这里把主模型预测表里的关键数量汇总出来：总期数、均值、峰值、低点和预测跨度。你可以先看这块判断预测是否符合业务常识，再看图和明细。": "Summarizes key values from the primary forecast table: periods, average, peak, low point, and forecast span. Use it first for business sanity checking.",
  "不同市场的节假日和促销结构不同。中国电商更重 618、双11、春节；美国零售更重黑五、网一、圣诞；通用零售适合没有明确国家的数据。": "Holiday and promotion structures differ by market. China e-commerce emphasizes 618, Singles Day, and Lunar New Year; US retail emphasizes Black Friday, Cyber Monday, and Christmas.",
  "这里记录模型前后的数据加工：无效行过滤、同日期聚合、业务下限裁剪、节假日窗口展开。若没有启用自动削峰填谷，会明确显示未启用。": "Records processing before and after modeling: invalid row filtering, same-date aggregation, business floor clipping, and holiday window expansion. If peak smoothing is not enabled, it is shown explicitly.",
  "推荐位是主模型中心预测；高位是推荐位上方的预测边界；低位是推荐位下方的预测边界。计算方法：先拟合历史，再用未来日期生成特征；高/低位约等于中心预测 ± z * 残差标准差，乘法/逻辑模式会先在变换空间计算再反变换。": "Recommended is the primary center forecast; high and low are upper/lower bounds. Calculation: fit history, generate future features, then center ± z times residual standard deviation. Multiplicative/logistic modes transform then invert.",
};

function localized(zh, en) {
  return currentLocale() === "zh-CN" ? zh : en;
}

function fieldSeparator() {
  return currentLocale() === "zh-CN" ? "：" : ": ";
}

function localizedHelpTip(text) {
  if (currentLocale() === "zh-CN") {
    const reverse = Object.fromEntries(Object.entries(helpTipTranslations).map(([zh, en]) => [en, zh]));
    return reverse[text] || text;
  }
  return helpTipTranslations[text] || text;
}

function localizedEventName(name) {
  if (currentLocale() === "zh-CN") return name;
  const eventNames = {
    元旦: "New Year",
    清明: "Qingming Festival",
    劳动节: "Labour Day",
    国庆: "China National Day",
    双11: "Singles Day",
    双12: "12.12 Campaign",
    春节: "Lunar New Year",
    端午: "Dragon Boat Festival",
    中秋: "Mid-Autumn Festival",
    加拿大元旦: "New Year Canada",
  };
  return eventNames[name] || name;
}

function localizedSeasonalityLabel(key) {
  const labels = {
    weekly: ["周", "Weekly"],
    monthly: ["月", "Monthly"],
    quarterly: ["季度", "Quarterly"],
    yearly: ["年", "Yearly"],
  };
  const label = labels[key] || [key, key];
  return lt(label[0], label[1]);
}

function localizedSeasonalityActive(seasonality) {
  if (seasonality.activeTerms?.length) {
    return seasonality.activeTerms.map((item) => `${localizedSeasonalityLabel(item.key)} ${item.order}`).join(" / ");
  }
  return (seasonality.activeLabels || []).map((label) => {
    const match = String(label).match(/^(周|月|季度|年)(\\d+)$/);
    if (!match) return label;
    const key = { 周: "weekly", 月: "monthly", 季度: "quarterly", 年: "yearly" }[match[1]];
    return `${localizedSeasonalityLabel(key)} ${match[2]}`;
  }).join(" / ");
}

function localizedSeasonalityDisabled(seasonality) {
  if (seasonality.modelWithoutProphetSeasonality) {
    const name = modelLabel(seasonality.modelWithoutProphetSeasonality);
    return lt(`${name} 不使用 Prophet 季节项`, `${name} does not use Prophet seasonality terms`);
  }
  if (seasonality.disabledTerms?.length) {
    return seasonality.disabledTerms.map((item) => {
      const label = localizedSeasonalityLabel(item.key);
      if (item.reason === "unchecked") return `${label}: ${lt("未勾选", "not selected")}`;
      return `${label}: ${lt(`历史不足 ${item.minCycles} 个周期`, `history has fewer than ${item.minCycles} cycles`)}`;
    }).join("<br>");
  }
  return (seasonality.disabled || []).join("<br>");
}

function localizedSeasonalityNotes(seasonality) {
  if (seasonality.orderNotes?.length) {
    return seasonality.orderNotes.map((item) => `${localizedSeasonalityLabel(item.key)} order ${item.from} -> ${item.to}: ${lt("避免短历史过拟合", "reduced to avoid short-history overfitting")}`).join("<br>");
  }
  return (seasonality.notes || []).join("<br>");
}

function modelApplicabilityNote(modelId, fallback = "") {
  const notes = {
    prophet: ["趋势 + 变化点 + 季节 + 节假日，适合可解释实验。", "Trend + changepoints + seasonality + holidays. Best for explainable experiments."],
    ets: ["指数平滑趋势，适合平稳增长、短历史和低噪声数据。", "Exponential smoothing trend. Best for stable growth, short history, and low-noise data."],
    sarima: ["季节周期 + AR 残差，适合稳定周期和短期惯性明显的数据。", "Seasonal cycle + AR residuals. Best when cycles and short-term inertia are stable."],
    featureMl: ["滞后、滚动均值、月份和活动特征，适合多因素真实业务数据。", "Lag, rolling average, month, and event features. Best for real multi-factor business data."],
    neuralProphet: ["自回归 + 趋势 + 季节 + 活动特征，适合非线性和近期记忆实验。", "Autoregression + trend + seasonality + events. Best for nonlinear and recent-memory experiments."],
    nbeats: ["趋势块 + 季节块分解，适合深度模型思想的高级对照。", "Trend block + seasonal block decomposition. Useful as an advanced deep-model-style benchmark."],
    movingAverage: ["最近窗口平均，稳健基线；复杂模型应明显超过它。", "Latest-window average. A robust baseline that complex models should clearly beat."],
    seasonalNaive: ["复用上一周期，适合稳定周/月/年周期，是必须比较的季节基线。", "Reuses the previous cycle. A required seasonal baseline for stable weekly/monthly/yearly cycles."],
  };
  const note = notes[modelId];
  return note ? lt(note[0], note[1]) : fallback;
}

function setTextKeepingHelp(selector, key, prefix = "") {
  setTextKeepingHelpValue(selector, t(key), prefix);
}

function setTextKeepingHelpValue(selector, text, prefix = "") {
  const element = document.querySelector(selector);
  if (!element) return;
  const help = element.querySelector(".help-icon");
  element.textContent = "";
  if (prefix) {
    const strong = document.createElement("strong");
    strong.textContent = prefix;
    element.appendChild(strong);
  }
  element.append(document.createTextNode(text == null ? "" : String(text)));
  if (help) {
    element.append(document.createTextNode(" "));
    element.appendChild(help);
  }
}

function setPlainText(selector, zh, en) {
  const element = document.querySelector(selector);
  if (element) element.textContent = localized(zh, en);
}

function setControlLabel(controlId, zh, en) {
  const control = document.getElementById(controlId);
  const label = control?.closest("label");
  if (!label) return;
  const text = localized(zh, en);
  const node = Array.from(label.childNodes).find((child) => child.nodeType === Node.TEXT_NODE && child.textContent.trim());
  if (node) {
    const prefix = label.firstElementChild === control ? " " : "";
    node.textContent = `${prefix}${text} `;
  } else {
    label.insertBefore(document.createTextNode(`${text} `), label.firstChild);
  }
}

function applySelectOptionI18n() {
  Object.entries(selectOptionBindings).forEach(([selectId, options]) => {
    const select = document.getElementById(selectId);
    if (!select) return;
    Array.from(select.options).forEach((option) => {
      const texts = options[option.value];
      if (texts) option.textContent = t(texts);
    });
  });
}

function applyStaticI18n() {
  staticBindings.forEach(([selector, key, prefix]) => {
    try {
      setTextKeepingHelp(selector, key, prefix);
    } catch (error) {
      console.warn("Static i18n binding failed", selector, key, error);
    }
  });
  staticTextBindings.forEach(([selector, key]) => {
    try {
      setTextKeepingHelp(selector, key);
    } catch (error) {
      console.warn("Plain i18n binding failed", selector, error);
    }
  });
  controlLabelBindings.forEach(([controlId, key]) => {
    try {
      setControlLabel(controlId, t(key), t(key));
    } catch (error) {
      console.warn("Control i18n binding failed", controlId, error);
    }
  });
  try {
    applySelectOptionI18n();
  } catch (error) {
    console.warn("Select i18n binding failed", error);
  }
  [
    ['.tab-btn[data-tab="data"]', "ui.data"],
    ['.tab-btn[data-tab="trend"]', "ui.trend"],
    ['.tab-btn[data-tab="season"]', "ui.season"],
    ['.tab-btn[data-tab="holiday"]', "ui.holiday"],
    ['.tab-btn[data-tab="output"]', "ui.output"],
  ].forEach(([selector, key]) => {
    const button = document.querySelector(selector);
    if (!button) return;
    button.title = t(key);
    button.setAttribute("aria-label", t(key));
  });
  document.documentElement.lang = currentLocale();
  els.userMenuBtn.title = t("ui.accountTheme");
  els.userMenuBtn.setAttribute("aria-label", t("ui.accountTheme"));
  document.querySelector('[data-theme-choice="light"]')?.setAttribute("title", t("theme.light"));
  document.querySelector('[data-theme-choice="light"]')?.setAttribute("aria-label", t("theme.light"));
  document.querySelector('[data-theme-choice="system"]')?.setAttribute("title", t("theme.system"));
  document.querySelector('[data-theme-choice="system"]')?.setAttribute("aria-label", t("theme.system"));
  document.querySelector('[data-theme-choice="dark"]')?.setAttribute("title", t("theme.dark"));
  document.querySelector('[data-theme-choice="dark"]')?.setAttribute("aria-label", t("theme.dark"));
  [
    ["deep", "theme.deep"],
    ["indigo", "theme.indigo"],
    ["graphite", "theme.graphite"],
    ["slate", "theme.slate"],
  ].forEach(([value, key]) => {
    const button = document.querySelector(`[data-palette-choice="${value}"]`);
    button?.setAttribute("title", t(key));
    button?.setAttribute("aria-label", t(key));
  });
  els.cap.placeholder = t("common.auto");
  els.eventDates.placeholder = t("placeholders.eventDates");
  applySidebarCollapsed();
  setStatus(state.statusMessageKey || "status.idle", state.statusState || "idle", state.statusMessageOptions || {});
}

let state = {
  rawRows: [],
  headers: [],
  csvText: "",
  sourceName: "",
  modelResult: null,
  experiments: [],
  dataAudit: null,
  backendExperiment: null,
};

const lunarHolidayDates = {
  springFestival: {
    2023: "2023-01-22",
    2024: "2024-02-10",
    2025: "2025-01-29",
    2026: "2026-02-17",
    2027: "2027-02-06",
    2028: "2028-01-26",
    2029: "2029-02-13",
  },
  dragonBoat: {
    2023: "2023-06-22",
    2024: "2024-06-10",
    2025: "2025-05-31",
    2026: "2026-06-19",
    2027: "2027-06-09",
    2028: "2028-05-28",
    2029: "2029-06-16",
  },
  midAutumn: {
    2023: "2023-09-29",
    2024: "2024-09-17",
    2025: "2025-10-06",
    2026: "2026-09-25",
    2027: "2027-09-15",
    2028: "2028-10-03",
    2029: "2029-09-22",
  },
};

const islamicRetailDates = {
  eidFitr: {
    2023: "2023-04-22",
    2024: "2024-04-10",
    2025: "2025-03-31",
    2026: "2026-03-20",
    2027: "2027-03-10",
    2028: "2028-02-27",
    2029: "2029-02-15",
  },
  eidAdha: {
    2023: "2023-06-29",
    2024: "2024-06-17",
    2025: "2025-06-07",
    2026: "2026-05-27",
    2027: "2027-05-17",
    2028: "2028-05-05",
    2029: "2029-04-24",
  },
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quote = false;

  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    const next = text[i + 1];
    if (c === '"' && quote && next === '"') {
      cell += '"';
      i += 1;
    } else if (c === '"') {
      quote = !quote;
    } else if (c === "," && !quote) {
      row.push(cell);
      cell = "";
    } else if ((c === "\n" || c === "\r") && !quote) {
      if (c === "\r" && next === "\n") i += 1;
      row.push(cell);
      if (row.some((v) => v.trim() !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += c;
    }
  }

  row.push(cell);
  if (row.some((v) => v.trim() !== "")) rows.push(row);
  if (rows.length < 2) throw new Error(lt("CSV 至少需要表头和一行数据", "CSV must include a header and at least one data row."));

  const headers = rows[0].map((h) => h.trim());
  const data = rows.slice(1).map((values) => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = (values[index] || "").trim();
    });
    return obj;
  });
  return { headers, data };
}

function setOptions(select, options, selectedValue = "") {
  select.innerHTML = "";
  options.forEach((option) => {
    const el = document.createElement("option");
    el.value = option.value;
    el.textContent = option.label;
    select.appendChild(el);
  });
  select.value = selectedValue;
}

function guessColumn(headers, names) {
  const lower = headers.map((h) => h.toLowerCase());
  for (const name of names) {
    const index = lower.findIndex((h) => h === name || h.includes(name));
    if (index >= 0) return headers[index];
  }
  return headers[0] || "";
}

function findMetricColumn(headers, names) {
  const lower = headers.map((h) => h.toLowerCase());
  for (const name of names) {
    const index = lower.findIndex((h) => h === name || h.includes(name));
    if (index >= 0) return headers[index];
  }
  return "";
}

function diagnoseMetricIntent(rows, headers, selectedValueColumn) {
  const quantityColumn = findMetricColumn(headers, ["quantity", "qty", "units", "volume", "销量", "数量", "件数"]);
  const priceColumn = findMetricColumn(headers, ["unit_price", "price", "单价", "价格", "售价"]);
  const revenueColumn = findMetricColumn(headers, ["total_price", "revenue", "amount", "gmv", "sales_amount", "sales", "金额", "总价", "收入", "收益", "销售额"]);
  if (!quantityColumn && !priceColumn && !revenueColumn) return null;

  let quantityTotal = 0;
  let revenueTotal = 0;
  let priceTotal = 0;
  let quantityCount = 0;
  let revenueCount = 0;
  let priceCount = 0;
  let zeroQuantityRevenueRows = 0;

  rows.forEach((row) => {
    const quantity = quantityColumn ? toNumber(row[quantityColumn]) : null;
    const revenue = revenueColumn ? toNumber(row[revenueColumn]) : null;
    const price = priceColumn ? toNumber(row[priceColumn]) : null;
    if (quantity !== null) {
      quantityTotal += quantity;
      quantityCount += 1;
    }
    if (revenue !== null) {
      revenueTotal += revenue;
      revenueCount += 1;
    }
    if (price !== null) {
      priceTotal += price;
      priceCount += 1;
    }
    if (quantity === 0 && revenue !== null && revenue !== 0) zeroQuantityRevenueRows += 1;
  });

  const selected = selectedValueColumn || "";
  const selectedIsRevenue = selected === revenueColumn || /total_price|revenue|amount|gmv|sales_amount|销售额|金额|总价|收入|收益/i.test(selected);
  const selectedIsQuantity = selected === quantityColumn || /quantity|qty|units|volume|销量|数量|件数/i.test(selected);
  const selectedIsPrice = selected === priceColumn || /unit_price|price|单价|价格|售价/i.test(selected);
  let recommendation = lt(
    "当前数据可做多口径诊断，建议先确认业务目标后再选择预测列。",
    "This dataset supports multi-metric diagnosis. Confirm the business goal before choosing the forecast column.",
  );

  if (selectedIsRevenue) {
    recommendation = lt("当前预测列更像收益/销售额，适合直接预测预计收益。", "The selected column looks like revenue or sales amount, so it is suitable for direct revenue forecasting.");
  } else if (selectedIsQuantity && revenueColumn) {
    recommendation = lt("当前预测列更像销量，可预测销量，再用历史加权单价估算收益。", "The selected column looks like quantity. Forecast units first, then estimate revenue with historical weighted unit price.");
  } else if (selectedIsQuantity) {
    recommendation = lt("当前预测列更像销量，适合预测销量；缺少收益列时不建议估算收益。", "The selected column looks like quantity and is suitable for unit sales forecasting. Revenue estimation is not recommended without a revenue field.");
  } else if (selectedIsPrice) {
    recommendation = lt("当前预测列更像单价，不建议按日期求和做规模预测；更适合做客单价/价格趋势。", "The selected column looks like unit price. It should not be summed by date for scale forecasting; it is better for price or AOV trend analysis.");
  } else if (revenueColumn && quantityColumn) {
    recommendation = lt("数据同时包含销量和收益，适合同时评估销量、收益、客单价三种口径。", "The dataset contains both quantity and revenue, so quantity, revenue, and AOV can all be evaluated.");
  } else if (revenueColumn) {
    recommendation = lt("数据包含收益字段，更适合预测收益/销售额。", "The dataset includes a revenue field, so revenue or sales amount is the better forecast target.");
  } else if (quantityColumn) {
    recommendation = lt("数据包含销量字段，更适合预测销量。", "The dataset includes a quantity field, so unit sales is the better forecast target.");
  } else if (priceColumn) {
    recommendation = lt("数据只有价格字段时，不适合直接预测销售规模。", "A dataset with only price fields is not suitable for direct sales-scale forecasting.");
  }

  return {
    selected,
    quantityColumn,
    priceColumn,
    revenueColumn,
    quantityCount,
    revenueCount,
    priceCount,
    quantityTotal,
    revenueTotal,
    averagePrice: priceCount ? priceTotal / priceCount : null,
    weightedUnitPrice: quantityTotal > 0 && revenueCount ? revenueTotal / quantityTotal : null,
    zeroQuantityRevenueRows,
    recommendation,
  };
}

function loadCsv(text, sourceName) {
  try {
    const parsed = parseCsv(text);
    state.rawRows = parsed.data;
    state.headers = parsed.headers;
    state.csvText = text;
    state.sourceName = sourceName || "sales.csv";

    const dateGuess = guessColumn(parsed.headers, ["date", "ds", "day", "日期", "时间"]);
    const valueGuess = guessColumn(parsed.headers, ["total_price", "total", "sales", "amount", "revenue", "gmv", "quantity", "qty", "金额", "总价", "销售", "销量", "销售额"]);
    const groupOptions = [{ value: "", label: lt("不分组", "No grouping") }].concat(parsed.headers.map((h) => ({ value: h, label: h })));

    setOptions(els.dateColumn, parsed.headers.map((h) => ({ value: h, label: h })), dateGuess);
    setOptions(els.valueColumn, parsed.headers.map((h) => ({ value: h, label: h })), valueGuess);
    setOptions(els.groupColumn, groupOptions, "");
    updateGroupFilter();

    state.modelResult = null;
    state.backendExperiment = null;
    drawEmpty();
    renderHolidayTemplatePreview(els.holidayCountry.value);
    setStatus("status.loaded", "ok", { sourceName, rows: parsed.data.length });
  } catch (error) {
    setStatus(null, "bad", {}, error.message);
  }
}

function setStatus(messageKey, type = "idle", options = {}, fallback = "") {
  state.statusMessageKey = messageKey;
  state.statusMessageOptions = options;
  state.statusState = type;
  els.statusText.textContent = messageKey ? t(messageKey, options) : fallback;
  els.status.dataset.state = type;
}

function apiBaseUrl() {
  return window.FREE_SALES_FORECAST_API || runtimeConfig().apiBaseUrl || "";
}

async function readJson(response) {
  if (!response.ok) {
    const text = await response.text();
    const path = response.url ? new URL(response.url).pathname : "";
    throw new Error(text || `HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ""}${path ? ` (${path})` : ""}`);
  }
  return response.json();
}

function backendModelList(primaryModel) {
  return Array.from(new Set([
    selectedModelId(primaryModel),
    "prophet",
    "ets",
    "sarima",
    "featureMl",
    "neuralProphet",
    "nbeats",
    "movingAverage",
    "seasonalNaive",
  ]));
}

async function syncBackendExperiment(params) {
  if (!state.csvText) return null;
  const form = new FormData();
  const filename = state.sourceName && state.sourceName.toLowerCase().endsWith(".csv") ? state.sourceName : "sales.csv";
  form.append("file", new File([state.csvText], filename, { type: "text/csv" }));

  const dataset = await fetch(`${apiBaseUrl()}/api/datasets/upload`, {
    method: "POST",
    body: form,
  }).then(readJson);

  const job = await fetch(`${apiBaseUrl()}/api/forecast-jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      dataset_id: dataset.id,
      date_column: els.dateColumn.value,
      value_column: els.valueColumn.value,
      group_column: els.groupColumn.value || null,
      group_value: els.groupFilter.value || null,
      horizon: params.horizon,
      cadence: params.forecastCadenceUnit,
      primary_model: selectedModelId(params.forecastModel),
      models: backendModelList(params.forecastModel),
      params,
    }),
  }).then(readJson);

  const finishedJob = job.experiment_id ? job : await waitForForecastJob(job.id);
  const experiment = finishedJob.experiment_id
    ? await fetch(`${apiBaseUrl()}/api/experiments/${finishedJob.experiment_id}`).then(readJson)
    : null;

  return { dataset, job: finishedJob, experiment };
}

async function waitForForecastJob(jobId) {
  const timeoutMs = Number(runtimeConfig().jobPollTimeoutMs || 120000);
  const intervalMs = Number(runtimeConfig().jobPollIntervalMs || 1000);
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    const job = await fetch(`${apiBaseUrl()}/api/forecast-jobs/${jobId}`).then(readJson);
    if (job.status === "succeeded") return job;
    if (job.status === "failed") throw new Error(job.error_message || `Forecast job failed: ${jobId}`);
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(`Forecast job timed out: ${jobId}`);
}

function renderBackendExperiment(syncResult) {
  if (!syncResult?.experiment) return;
  const { dataset, job, experiment } = syncResult;
  const recommended = (experiment.models || []).find((model) => model.model_id === experiment.recommended_model);
  const forecastUrl = recommended?.forecast_download_url ? `${apiBaseUrl()}${recommended.forecast_download_url}` : "";
  const fittedUrl = recommended?.fitted_download_url ? `${apiBaseUrl()}${recommended.fitted_download_url}` : "";
  const rankings = (experiment.summary?.model_rankings || [])
    .slice(0, 4)
    .map((item) => `${escapeHtml(item.model_name)} WAPE ${formatNumber(item.wape, 2)}%`)
    .join("<br>");
  els.processingAudit.insertAdjacentHTML(
    "afterbegin",
    `<div class="audit-card">
      <strong>${escapeHtml(lt("后端实验", "Backend Experiment"))}</strong>
      <span>Dataset${fieldSeparator()}${escapeHtml(dataset.id)}</span>
      <span>Job${fieldSeparator()}${escapeHtml(job.id)} / ${escapeHtml(job.status)}</span>
      <span>Experiment${fieldSeparator()}${escapeHtml(experiment.id)}</span>
      <span>${escapeHtml(lt("推荐模型", "Recommended model"))}${fieldSeparator()}${escapeHtml(modelName(recommended?.model_id || experiment.recommended_model) || recommended?.model_name || "-")}</span>
      <span>${rankings || escapeHtml(lt("暂无模型排名", "No model ranking yet"))}</span>
      ${forecastUrl ? `<a href="${forecastUrl}" target="_blank" rel="noreferrer">${escapeHtml(lt("下载推荐模型预测 CSV", "Download recommended forecast CSV"))}</a>` : ""}
      ${fittedUrl ? `<a href="${fittedUrl}" target="_blank" rel="noreferrer">${escapeHtml(lt("下载推荐模型拟合 CSV", "Download recommended fitted CSV"))}</a>` : ""}
    </div>`,
  );
}

function updateGroupFilter() {
  const column = els.groupColumn.value;
  if (!column) {
    setOptions(els.groupFilter, [{ value: "", label: t("common.all") }], "");
    els.groupFilter.disabled = true;
    return;
  }
  const values = Array.from(new Set(state.rawRows.map((row) => row[column]).filter(Boolean))).sort();
  setOptions(els.groupFilter, [{ value: "", label: t("common.all") }].concat(values.map((v) => ({ value: v, label: v }))), "");
  els.groupFilter.disabled = false;
}

function toNumber(value) {
  const normalized = String(value).replace(/[,\s¥￥$]/g, "");
  const num = Number(normalized);
  return Number.isFinite(num) ? num : null;
}

function parseDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function prepareSeries() {
  const dateColumn = els.dateColumn.value;
  const valueColumn = els.valueColumn.value;
  const groupColumn = els.groupColumn.value;
  const groupFilter = els.groupFilter.value;
  const grouped = new Map();
  const dateCounts = new Map();
  const audit = {
    sourceRows: state.rawRows.length,
    groupSkipped: 0,
    invalidDate: 0,
    invalidValue: 0,
    validRows: 0,
    outputRows: 0,
    aggregatedDates: 0,
    aggregationSamples: [],
    maxGapDays: 0,
    missingDateCount: 0,
    missingDateSamples: [],
    metricDiagnosis: null,
  };
  const scopedRows = [];

  state.rawRows.forEach((row) => {
    if (groupColumn && groupFilter && row[groupColumn] !== groupFilter) {
      audit.groupSkipped += 1;
      return;
    }
    scopedRows.push(row);
    const date = parseDate(row[dateColumn]);
    const value = toNumber(row[valueColumn]);
    if (!date) {
      audit.invalidDate += 1;
      return;
    }
    if (value === null) {
      audit.invalidValue += 1;
      return;
    }
    const key = formatDate(date);
    grouped.set(key, (grouped.get(key) || 0) + value);
    dateCounts.set(key, (dateCounts.get(key) || 0) + 1);
    audit.validRows += 1;
  });

  const records = Array.from(grouped.entries())
    .map(([date, y]) => ({ ds: parseDate(date), y }))
    .sort((a, b) => a.ds - b.ds);

  audit.outputRows = records.length;
  audit.aggregatedDates = Array.from(dateCounts.values()).filter((count) => count > 1).length;
  audit.aggregationSamples = Array.from(dateCounts.entries())
    .filter(([, count]) => count > 1)
    .slice(0, 8)
    .map(([date, count]) => ({ date, count, value: grouped.get(date) }));
  for (let i = 1; i < records.length; i += 1) {
    const gap = Math.round((records[i].ds - records[i - 1].ds) / 86400000);
    audit.maxGapDays = Math.max(audit.maxGapDays, gap);
    if (gap > 1) {
      audit.missingDateCount += gap - 1;
      if (audit.missingDateSamples.length < 6) {
        audit.missingDateSamples.push(lt(
          `${formatDate(addDays(records[i - 1].ds, 1))} 至 ${formatDate(addDays(records[i].ds, -1))}`,
          `${formatDate(addDays(records[i - 1].ds, 1))} to ${formatDate(addDays(records[i].ds, -1))}`,
        ));
      }
    }
  }
  audit.metricDiagnosis = diagnoseMetricIntent(scopedRows, state.headers, valueColumn);
  state.dataAudit = audit;

  if (records.length < 8) {
    throw new Error(currentLocale() === "zh-CN" ? "有效数据少于 8 条，无法稳定拟合" : "Fewer than 8 valid points are available, so fitting is unstable.");
  }
  return records;
}

function median(values) {
  const sorted = values.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function inferCadence(records) {
  const gaps = [];
  const monthGaps = [];
  for (let i = 1; i < records.length; i += 1) {
    const gap = Math.round((records[i].ds - records[i - 1].ds) / 86400000);
    if (gap > 0) gaps.push(gap);
    const monthGap = (records[i].ds.getFullYear() - records[i - 1].ds.getFullYear()) * 12 + records[i].ds.getMonth() - records[i - 1].ds.getMonth();
    if (monthGap > 0) monthGaps.push(monthGap);
  }
  const stepDays = Math.max(1, Math.round(median(gaps) || 1));
  const looksMonthly = stepDays >= 27 && stepDays <= 32 && records.filter((row) => row.ds.getDate() <= 3).length / records.length > 0.8;
  if (looksMonthly) {
    const stepMonths = Math.max(1, Math.round(median(monthGaps) || 1));
    return { kind: "month", stepMonths, stepDays: 30.4375 * stepMonths, label: lt(`${stepMonths} 月`, `${stepMonths} month${stepMonths > 1 ? "s" : ""}`) };
  }
  if (stepDays % 7 === 0) return { kind: "day", stepDays, label: lt(`${stepDays / 7} 周`, `${stepDays / 7} week${stepDays / 7 > 1 ? "s" : ""}`) };
  return { kind: "day", stepDays, label: lt(`${stepDays} 天`, `${stepDays} day${stepDays > 1 ? "s" : ""}`) };
}

function resolveForecastCadence(historyCadence, params) {
  const step = Math.max(1, Number(params.forecastStep) || 1);
  if (!params.forecastCadenceUnit || params.forecastCadenceUnit === "auto") return { ...historyCadence, source: "auto" };
  if (params.forecastCadenceUnit === "month") {
    return { kind: "month", stepMonths: step, stepDays: 30.4375 * step, label: lt(`${step} 月`, `${step} month${step > 1 ? "s" : ""}`), source: "manual" };
  }
  if (params.forecastCadenceUnit === "week") {
    return { kind: "day", stepDays: step * 7, label: lt(`${step} 周`, `${step} week${step > 1 ? "s" : ""}`), source: "manual" };
  }
  return { kind: "day", stepDays: step, label: lt(`${step} 天`, `${step} day${step > 1 ? "s" : ""}`), source: "manual" };
}

function cadenceLabel(cadence) {
  if (!cadence) return t("common.auto");
  if (cadence.kind === "month") {
    const step = cadence.stepMonths || 1;
    return lt(`${step} 月`, `${step} month${step > 1 ? "s" : ""}`);
  }
  const stepDays = cadence.stepDays || 1;
  if (stepDays % 7 === 0) {
    const weeks = stepDays / 7;
    return lt(`${weeks} 周`, `${weeks} week${weeks > 1 ? "s" : ""}`);
  }
  return lt(`${stepDays} 天`, `${stepDays} day${stepDays > 1 ? "s" : ""}`);
}

function buildFeatureRow(date, startDate, stepDays, changepoints, params, withKinds = false) {
  const days = (date - startDate) / 86400000;
  const t = days / stepDays;
  const row = [1];
  const kinds = ["intercept"];

  if (params.growth !== "flat") {
    row.push(t);
    kinds.push("trend");
    changepoints.forEach((cp) => {
      row.push(Math.max(0, t - cp));
      kinds.push("changepoint");
    });
  }

  const seasonality = params.effectiveSeasonality || params;
  if (seasonality.weekly) addFourier(row, kinds, days, 7, seasonality.weeklyOrder);
  if (seasonality.monthly) addFourier(row, kinds, days, 30.4375, seasonality.monthlyOrder);
  if (seasonality.quarterly) addFourier(row, kinds, days, 91.3125, seasonality.quarterlyOrder);
  if (seasonality.yearly) addFourier(row, kinds, days, 365.25, seasonality.yearlyOrder);

  params.events.forEach((event) => {
    row.push(holidayImpact(date, event, params));
    kinds.push("holiday");
  });

  return withKinds ? { values: row, kinds } : row;
}

function addFourier(row, kinds, days, period, order) {
  for (let k = 1; k <= order; k += 1) {
    const angle = (2 * Math.PI * k * days) / period;
    row.push(Math.sin(angle), Math.cos(angle));
    kinds.push("seasonality", "seasonality");
  }
}

function standardizeMatrix(matrix) {
  const columns = matrix[0].length;
  const means = Array(columns).fill(0);
  const stds = Array(columns).fill(1);

  for (let j = 1; j < columns; j += 1) {
    for (let i = 0; i < matrix.length; i += 1) means[j] += matrix[i][j];
    means[j] /= matrix.length;
    let variance = 0;
    for (let i = 0; i < matrix.length; i += 1) variance += (matrix[i][j] - means[j]) ** 2;
    stds[j] = Math.sqrt(variance / matrix.length) || 1;
  }

  return {
    matrix: matrix.map((row) => row.map((v, j) => (j === 0 ? v : (v - means[j]) / stds[j]))),
    means,
    stds,
  };
}

function applyStandardization(row, means, stds) {
  return row.map((v, j) => (j === 0 ? v : (v - means[j]) / stds[j]));
}

function resolveSeasonality(params, records, spanDays) {
  const defs = [
    { key: "weekly", orderKey: "weeklyOrder", label: "周", period: 7, minCycles: 3 },
    { key: "monthly", orderKey: "monthlyOrder", label: "月", period: 30.4375, minCycles: 3 },
    { key: "quarterly", orderKey: "quarterlyOrder", label: "季度", period: 91.3125, minCycles: 4 },
    { key: "yearly", orderKey: "yearlyOrder", label: "年", period: 365.25, minCycles: 2 },
  ];
  const resolved = { notes: [], disabled: [], activeLabels: [], activeTerms: [], disabledTerms: [], orderNotes: [] };
  const maxOrderByRows = Math.max(1, Math.floor(records.length / 8));

  defs.forEach((def) => {
    resolved[def.key] = false;
    resolved[def.orderKey] = 0;
    if (!params[def.key]) {
      resolved.disabled.push(`${def.label}：未勾选`);
      resolved.disabledTerms.push({ key: def.key, reason: "unchecked" });
      return;
    }

    const cycles = spanDays / def.period;
    if (cycles < def.minCycles) {
      resolved.disabled.push(`${def.label}：历史不足 ${def.minCycles} 个周期`);
      resolved.disabledTerms.push({ key: def.key, reason: "shortHistory", minCycles: def.minCycles });
      return;
    }

    const maxOrderByCycles = Math.max(1, Math.floor(cycles * 1.5));
    const order = Math.max(1, Math.min(params[def.orderKey], maxOrderByRows, maxOrderByCycles));
    resolved[def.key] = true;
    resolved[def.orderKey] = order;
    resolved.activeLabels.push(`${def.label}${order}`);
    resolved.activeTerms.push({ key: def.key, order });
    if (order < params[def.orderKey]) {
      resolved.notes.push(`${def.label} order ${params[def.orderKey]} -> ${order}，避免短历史过拟合`);
      resolved.orderNotes.push({ key: def.key, from: params[def.orderKey], to: order });
    }
  });

  return resolved;
}

function ridgeRegression(x, y, penalties) {
  const rows = x.length;
  const cols = x[0].length;
  const a = Array.from({ length: cols }, () => Array(cols).fill(0));
  const b = Array(cols).fill(0);

  for (let i = 0; i < rows; i += 1) {
    for (let j = 0; j < cols; j += 1) {
      b[j] += x[i][j] * y[i];
      for (let k = 0; k < cols; k += 1) a[j][k] += x[i][j] * x[i][k];
    }
  }

  for (let j = 1; j < cols; j += 1) a[j][j] += penalties[j] || 0;
  return solveLinearSystem(a, b);
}

function solveLinearSystem(a, b) {
  const n = b.length;
  const matrix = a.map((row, i) => row.concat(b[i]));

  for (let col = 0; col < n; col += 1) {
    let pivot = col;
    for (let row = col + 1; row < n; row += 1) {
      if (Math.abs(matrix[row][col]) > Math.abs(matrix[pivot][col])) pivot = row;
    }
    if (Math.abs(matrix[pivot][col]) < 1e-10) continue;
    [matrix[col], matrix[pivot]] = [matrix[pivot], matrix[col]];

    const div = matrix[col][col];
    for (let j = col; j <= n; j += 1) matrix[col][j] /= div;

    for (let row = 0; row < n; row += 1) {
      if (row === col) continue;
      const factor = matrix[row][col];
      for (let j = col; j <= n; j += 1) matrix[row][j] -= factor * matrix[col][j];
    }
  }

  return matrix.map((row) => (Number.isFinite(row[n]) ? row[n] : 0));
}

function dot(a, b) {
  return a.reduce((sum, value, index) => sum + value * b[index], 0);
}

function quantileForInterval(width) {
  if (width >= 0.95) return 1.96;
  if (width >= 0.9) return 1.645;
  return 1.282;
}

function parseEvents() {
  return els.eventDates.value
    .split(/\n+/)
    .flatMap((line) => line.split(/;|；/))
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/,|，/).map((part) => part.trim());
      const date = parseDate(parts[0]);
      return date ? { date, name: parts[1] || "custom" } : null;
    })
    .filter(Boolean);
}

function buildHolidayEvents(country, startDate, endDate) {
  if (country === "none") return [];
  const years = [];
  for (let year = startDate.getFullYear() - 1; year <= endDate.getFullYear() + 1; year += 1) years.push(year);
  return years.flatMap((year) => {
    if (country === "CN") return chinaRetailEvents(year);
    if (country === "US") return usRetailEvents(year);
    if (country === "CA") return canadaRetailEvents(year);
    if (country === "MX") return mexicoRetailEvents(year);
    if (country === "NAM") return northAmericaRetailEvents(year);
    if (country === "EU") return europeRetailEvents(year);
    if (country === "UK") return ukRetailEvents(year);
    if (country === "SEA") return southeastAsiaRetailEvents(year);
    return globalRetailEvents(year);
  });
}

function chinaRetailEvents(year) {
  const events = [
    fixedEvent(year, 1, 1, "元旦"),
    fixedEvent(year, 4, 4, "清明"),
    fixedEvent(year, 5, 1, "劳动节"),
    fixedEvent(year, 6, 18, "618"),
    fixedEvent(year, 10, 1, "国庆"),
    fixedEvent(year, 11, 11, "双11"),
    fixedEvent(year, 12, 12, "双12"),
  ];
  [
    ["springFestival", "春节"],
    ["dragonBoat", "端午"],
    ["midAutumn", "中秋"],
  ].forEach(([key, name]) => {
    const date = lunarHolidayDates[key][year];
    if (date) events.push({ date: parseDate(date), name });
  });
  return events.filter((event) => event.date);
}

function usRetailEvents(year) {
  const thanksgiving = nthWeekdayOfMonth(year, 10, 4, 4);
  return [
    fixedEvent(year, 1, 1, "New Year"),
    fixedEvent(year, 2, 14, "Valentine's Day"),
    nthWeekdayOfMonth(year, 4, 0, 2, "Mother's Day"),
    lastWeekdayOfMonth(year, 4, 1, "Memorial Day"),
    fixedEvent(year, 7, 4, "Independence Day"),
    nthWeekdayOfMonth(year, 8, 1, 1, "Labor Day"),
    { date: thanksgiving, name: "Thanksgiving" },
    { date: addDays(thanksgiving, 1), name: "Black Friday" },
    { date: addDays(thanksgiving, 4), name: "Cyber Monday" },
    fixedEvent(year, 12, 25, "Christmas"),
  ].filter((event) => event.date);
}

function canadaRetailEvents(year) {
  const easter = easterDate(year);
  return [
    fixedEvent(year, 1, 1, "加拿大元旦"),
    nthWeekdayOfMonth(year, 1, 1, 3, "Family Day"),
    { date: addDays(easter, -2), name: "Good Friday" },
    { date: addDays(easter, 1), name: "Easter Monday" },
    lastMondayBefore(year, 4, 25, "Victoria Day"),
    fixedEvent(year, 7, 1, "Canada Day"),
    nthWeekdayOfMonth(year, 7, 1, 1, "Civic Holiday"),
    nthWeekdayOfMonth(year, 8, 1, 1, "Labour Day"),
    fixedEvent(year, 9, 30, "Truth and Reconciliation Day"),
    nthWeekdayOfMonth(year, 9, 1, 2, "Thanksgiving Canada"),
    fixedEvent(year, 11, 11, "Remembrance Day"),
    fixedEvent(year, 12, 25, "Christmas"),
    fixedEvent(year, 12, 26, "Boxing Day"),
    blackFridayEvent(year),
    cyberMondayEvent(year),
  ].filter((event) => event.date);
}

function mexicoRetailEvents(year) {
  const easter = easterDate(year);
  return [
    fixedEvent(year, 1, 1, "Año Nuevo"),
    nthWeekdayOfMonth(year, 1, 1, 1, "Constitution Day"),
    nthWeekdayOfMonth(year, 2, 1, 3, "Benito Juárez Day"),
    { date: addDays(easter, -3), name: "Semana Santa" },
    { date: addDays(easter, -2), name: "Good Friday" },
    fixedEvent(year, 5, 1, "Labour Day Mexico"),
    fixedEvent(year, 5, 10, "Mother's Day Mexico"),
    fixedEvent(year, 9, 16, "Independence Day Mexico"),
    fixedEvent(year, 11, 1, "Día de Muertos Retail"),
    fixedEvent(year, 11, 2, "Día de Muertos"),
    nthWeekdayOfMonth(year, 10, 1, 3, "Revolution Day"),
    fixedEvent(year, 12, 12, "Día de la Virgen"),
    fixedEvent(year, 12, 25, "Christmas"),
    nthWeekdayOfMonth(year, 10, 5, 3, "El Buen Fin"),
    blackFridayEvent(year),
    cyberMondayEvent(year),
  ].filter((event) => event.date);
}

function northAmericaRetailEvents(year) {
  return mergeEvents([
    usRetailEvents(year).map(prefixEvent("US")),
    canadaRetailEvents(year).map(prefixEvent("CA")),
    mexicoRetailEvents(year).map(prefixEvent("MX")),
  ]);
}

function europeRetailEvents(year) {
  const easter = easterDate(year);
  return [
    fixedEvent(year, 1, 1, "New Year Europe"),
    fixedEvent(year, 1, 6, "Epiphany"),
    fixedEvent(year, 2, 14, "Valentine's Day"),
    { date: addDays(easter, -2), name: "Good Friday Europe" },
    { date: addDays(easter, 1), name: "Easter Monday Europe" },
    fixedEvent(year, 5, 1, "Labour Day Europe"),
    fixedEvent(year, 5, 9, "Europe Day"),
    fixedEvent(year, 7, 1, "Summer Sale Europe"),
    fixedEvent(year, 8, 15, "Assumption / Summer Holiday"),
    fixedEvent(year, 9, 1, "Back to School Europe"),
    fixedEvent(year, 11, 1, "All Saints / Singles Day Ramp"),
    fixedEvent(year, 11, 11, "Singles Day Europe"),
    blackFridayEvent(year),
    cyberMondayEvent(year),
    fixedEvent(year, 12, 6, "St Nicholas / Holiday Shopping"),
    fixedEvent(year, 12, 24, "Christmas Eve Europe"),
    fixedEvent(year, 12, 25, "Christmas Europe"),
    fixedEvent(year, 12, 26, "Boxing Day / St Stephen"),
  ].filter((event) => event.date);
}

function ukRetailEvents(year) {
  const easter = easterDate(year);
  return [
    observedFixedEvent(year, 1, 1, "New Year's Day UK"),
    { date: addDays(easter, -2), name: "Good Friday UK" },
    { date: addDays(easter, 1), name: "Easter Monday UK" },
    nthWeekdayOfMonth(year, 4, 1, 1, "Early May Bank Holiday"),
    lastWeekdayOfMonth(year, 4, 1, "Spring Bank Holiday"),
    lastWeekdayOfMonth(year, 7, 1, "Summer Bank Holiday"),
    fixedEvent(year, 10, 31, "Halloween UK"),
    fixedEvent(year, 11, 5, "Bonfire Night"),
    fixedEvent(year, 11, 11, "Singles Day UK"),
    blackFridayEvent(year),
    cyberMondayEvent(year),
    observedFixedEvent(year, 12, 25, "Christmas Day UK"),
    observedFixedEvent(year, 12, 26, "Boxing Day UK"),
  ].filter((event) => event.date);
}

function southeastAsiaRetailEvents(year) {
  const events = [
    fixedEvent(year, 1, 1, "New Year SEA"),
    fixedEvent(year, 2, 14, "Valentine's Day SEA"),
    fixedEvent(year, 3, 3, "3.3 Campaign"),
    fixedEvent(year, 4, 4, "4.4 Campaign"),
    fixedEvent(year, 4, 13, "Songkran / Thai New Year"),
    fixedEvent(year, 4, 14, "Songkran Holiday"),
    fixedEvent(year, 4, 15, "Songkran Holiday"),
    fixedEvent(year, 5, 5, "5.5 Campaign"),
    fixedEvent(year, 6, 6, "6.6 Campaign"),
    fixedEvent(year, 7, 7, "7.7 Campaign"),
    fixedEvent(year, 8, 8, "8.8 Campaign"),
    fixedEvent(year, 8, 9, "Singapore National Day"),
    fixedEvent(year, 8, 17, "Indonesia Independence Day"),
    fixedEvent(year, 8, 31, "Malaysia Merdeka"),
    fixedEvent(year, 9, 9, "9.9 Campaign"),
    fixedEvent(year, 10, 10, "10.10 Campaign"),
    fixedEvent(year, 11, 11, "11.11 Campaign"),
    fixedEvent(year, 12, 12, "12.12 Campaign"),
    fixedEvent(year, 12, 25, "Christmas SEA"),
  ];
  const lunarNewYear = lunarHolidayDates.springFestival[year];
  if (lunarNewYear) events.push({ date: parseDate(lunarNewYear), name: "Lunar New Year SEA" });
  const eidFitr = islamicRetailDates.eidFitr[year];
  if (eidFitr) events.push({ date: parseDate(eidFitr), name: "Hari Raya / Eid al-Fitr" });
  const eidAdha = islamicRetailDates.eidAdha[year];
  if (eidAdha) events.push({ date: parseDate(eidAdha), name: "Eid al-Adha" });
  return events.filter((event) => event.date);
}

function globalRetailEvents(year) {
  return [
    fixedEvent(year, 1, 1, "New Year"),
    fixedEvent(year, 2, 14, "Valentine's Day"),
    fixedEvent(year, 8, 15, "Back to School"),
    fixedEvent(year, 11, 11, "Singles Day"),
    fixedEvent(year, 12, 15, "Holiday Season"),
    fixedEvent(year, 12, 25, "Christmas"),
  ];
}

function fixedEvent(year, month, day, name) {
  return { date: new Date(year, month - 1, day), name };
}

function observedFixedEvent(year, month, day, name) {
  const date = new Date(year, month - 1, day);
  if (date.getDay() === 6) return { date: addDays(date, 2), name: `${name} substitute` };
  if (date.getDay() === 0) return { date: addDays(date, 1), name: `${name} substitute` };
  return { date, name };
}

function nthWeekdayOfMonth(year, monthIndex, weekday, nth, name = "") {
  const date = new Date(year, monthIndex, 1);
  const offset = (weekday - date.getDay() + 7) % 7;
  date.setDate(1 + offset + (nth - 1) * 7);
  return name ? { date, name } : date;
}

function lastWeekdayOfMonth(year, monthIndex, weekday, name) {
  const date = new Date(year, monthIndex + 1, 0);
  const offset = (date.getDay() - weekday + 7) % 7;
  date.setDate(date.getDate() - offset);
  return { date, name };
}

function lastMondayBefore(year, monthIndex, day, name) {
  const date = new Date(year, monthIndex, day - 1);
  const offset = (date.getDay() - 1 + 7) % 7;
  date.setDate(date.getDate() - offset);
  return { date, name };
}

function easterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function blackFridayEvent(year) {
  return { date: addDays(nthWeekdayOfMonth(year, 10, 4, 4), 1), name: "Black Friday" };
}

function cyberMondayEvent(year) {
  return { date: addDays(nthWeekdayOfMonth(year, 10, 4, 4), 4), name: "Cyber Monday" };
}

function prefixEvent(prefix) {
  return (event) => ({ date: event.date, name: `${prefix}: ${event.name}` });
}

function mergeEvents(groups) {
  return groups.flat();
}

function holidayImpact(date, event, params) {
  if (!event || !event.date) return 0;
  if (params.cadence?.kind === "month") {
    return date.getFullYear() === event.date.getFullYear() && date.getMonth() === event.date.getMonth() ? 1 : 0;
  }
  const distance = Math.round((date - event.date) / 86400000);
  return distance >= params.holidayLowerWindow && distance <= params.holidayUpperWindow ? 1 : 0;
}

function activeEventsForDate(date, params) {
  const names = params.events
    .filter((event) => holidayImpact(date, event, params) > 0)
    .map((event) => event.name)
    .filter(Boolean);
  return Array.from(new Set(names));
}

function localizedEventList(events) {
  return Array.from(new Set((events || []).map(localizedEventName).filter(Boolean)));
}

function marketAdvice(params, cadence) {
  if (params.holidayCountry === "CN") {
    return [
      lt("中国电商：618、双11、双12通常是强促销峰值，春节可能出现节前备货和节后低谷。", "China e-commerce: 618, Singles Day, and 12.12 are usually strong promotion peaks. Lunar New Year may create pre-holiday stocking and post-holiday dips."),
      cadence.kind === "month"
        ? lt("当前是月度数据，活动会映射到所在月份；如果要研究预售节奏，建议用日度数据。", "This is monthly data, so events are mapped to their months. Use daily data if you need to study presale timing.")
        : lt("日/周数据会使用 lower_window 和 upper_window 捕捉预售、返场、节后影响。", "Daily/weekly data uses lower_window and upper_window to capture presales, reruns, and post-event effects."),
      lt("调参建议：如果大促被低估，提高 holidays prior；如果每年大促被过度复制，降低 holidays prior 或缩短窗口。", "Tuning: raise holidays prior if major campaigns are underestimated. Lower it or shorten the window if peaks are over-copied every year."),
    ];
  }
  if (params.holidayCountry === "US") {
    return [
      lt("美国零售：Thanksgiving 后的 Black Friday 和 Cyber Monday 是核心峰值，Christmas 前后常见季节性抬升。", "US retail: Black Friday and Cyber Monday after Thanksgiving are core peaks, with seasonal uplift around Christmas."),
      cadence.kind === "month"
        ? lt("当前是月度数据，黑五/网一会合并到 11 月，圣诞会进入 12 月。", "This is monthly data, so Black Friday and Cyber Monday merge into November, while Christmas appears in December.")
        : lt("日/周数据适合把 Black Friday 和 Cyber Monday 拆成相邻但不同的活动影响。", "Daily/weekly data can separate Black Friday and Cyber Monday as adjacent but distinct event effects."),
      lt("调参建议：美国节日更集中在 Q4，年度季节性和节假日特征要一起看，避免重复解释同一波峰。", "Tuning: US retail holidays cluster in Q4. Review yearly seasonality and holiday features together to avoid explaining the same peak twice."),
    ];
  }
  if (params.holidayCountry === "CA") {
    return [
      lt("加拿大：Canada Day、Thanksgiving、Boxing Day 和黑五/网一对零售很关键，Victoria Day 常作为夏季消费起点。", "Canada: Canada Day, Thanksgiving, Boxing Day, Black Friday, and Cyber Monday matter for retail. Victoria Day often starts summer consumption."),
      cadence.kind === "month"
        ? lt("当前是月度数据，Family Day、Victoria Day、Thanksgiving 会映射到所在月份。", "This is monthly data, so Family Day, Victoria Day, and Thanksgiving map to their months.")
        : lt("日/周数据建议扩大 Boxing Day 和黑五窗口，捕捉节前节后促销。", "For daily/weekly data, widen Boxing Day and Black Friday windows to capture pre/post promotions."),
      lt("调参建议：加拿大存在省级差异，这里采用全国零售模板；如果数据只覆盖某省，建议用自定义活动补省级假日。", "Tuning: Canada has provincial differences. This is a national retail template; add provincial holidays as custom events when needed."),
    ];
  }
  if (params.holidayCountry === "MX") {
    return [
      lt("墨西哥：El Buen Fin、独立日、亡灵节、圣诞和母亲节是常见消费节点。", "Mexico: El Buen Fin, Independence Day, Day of the Dead, Christmas, and Mother's Day are common demand moments."),
      cadence.kind === "month"
        ? lt("当前是月度数据，Buen Fin 和黑五都会集中在 11 月，需要避免重复解释。", "This is monthly data, so Buen Fin and Black Friday both land in November. Avoid duplicate explanations.")
        : lt("日/周数据可以分辨 Buen Fin、黑五、网一之间的间隔影响。", "Daily/weekly data can separate Buen Fin, Black Friday, and Cyber Monday effects."),
      lt("调参建议：墨西哥跨境业务常受美国黑五影响，建议保留黑五/网一，同时关注本地 Buen Fin。", "Tuning: cross-border Mexico sales are often affected by US Black Friday. Keep Black Friday/Cyber Monday and also model local Buen Fin."),
    ];
  }
  if (params.holidayCountry === "NAM") {
    return [
      lt("北美组合：同时注入美国、加拿大、墨西哥模板，适合合并了美加墨销量的区域盘。", "North America: injects US, Canada, and Mexico templates together. Use it for combined US/CA/MX regional sales."),
      lt("如果某一国家占比很高，组合模板可能引入过多弱特征；更精确的做法是按国家分组分别预测再汇总。", "If one country dominates, the combined template may add weak features. More accurate practice is forecasting by country and then aggregating."),
      lt("调参建议：从较低 holidays prior 开始，只有当合并区域大促峰值稳定出现时再提高。", "Tuning: start with a low holidays prior and increase it only when combined regional promotion peaks are stable."),
    ];
  }
  if (params.holidayCountry === "EU") {
    return [
      lt("欧洲：不存在单一官方节假日日历，这里使用泛欧洲零售模板，覆盖复活节、劳动节、暑期折扣、返校季、黑五和圣诞季。", "Europe: there is no single official holiday calendar. This pan-European retail template covers Easter, Labour Day, summer sales, back-to-school, Black Friday, and Christmas."),
      lt("德国、法国、意大利、西班牙等国家差异明显；如果数据能按国家拆分，建议拆分后使用自定义活动增强。", "Germany, France, Italy, Spain, and other countries differ materially. Split by country and enrich with custom events when possible."),
      lt("调参建议：欧洲季节性常和暑期/圣诞重叠，先用较低 holidays prior，避免和年度季节性重复解释。", "Tuning: European holidays often overlap with summer/Christmas seasonality. Start with a low holidays prior to avoid double-counting yearly seasonality."),
    ];
  }
  if (params.holidayCountry === "UK") {
    return [
      lt("英国：Bank Holidays、Good Friday、Easter Monday、黑五、网一、圣诞和 Boxing Day 对零售有明显影响。", "UK: Bank Holidays, Good Friday, Easter Monday, Black Friday, Cyber Monday, Christmas, and Boxing Day can materially affect retail."),
      cadence.kind === "month"
        ? lt("当前是月度数据，复活节和银行假日会进入所在月份，适合看月度峰谷。", "This is monthly data, so Easter and bank holidays land in their months. It is best for monthly peaks and dips.")
        : lt("日/周数据更适合分析银行假日长周末和圣诞/Boxing Day 的短期冲击。", "Daily/weekly data is better for short-term effects from long bank-holiday weekends and Christmas/Boxing Day."),
      lt("调参建议：英国模板按 England/Wales 零售建模近似；苏格兰、北爱差异建议用自定义活动补充。", "Tuning: this UK template approximates England/Wales retail. Add custom events for Scotland and Northern Ireland differences."),
    ];
  }
  if (params.holidayCountry === "SEA") {
    return [
      lt("东南亚：区域内差异很大，这里覆盖 Lunar New Year、Ramadan/Raya、Songkran、9.9/10.10/11.11/12.12 等电商大促。", "Southeast Asia: markets differ heavily. This template covers Lunar New Year, Ramadan/Raya, Songkran, and 9.9/10.10/11.11/12.12 campaigns."),
      lt("印尼、马来、泰国、越南、新加坡、菲律宾节日结构不同；跨国数据建议按国家或平台分组预测。", "Indonesia, Malaysia, Thailand, Vietnam, Singapore, and the Philippines have different holiday structures. Forecast by country or platform when possible."),
      lt("调参建议：东南亚电商大促密度高，holiday prior 不宜过大，否则模型会把正常增长误认为活动冲击。", "Tuning: SEA e-commerce has dense campaign calendars. Keep holiday prior conservative so normal growth is not mistaken for event impact."),
    ];
  }
  if (params.holidayCountry === "GLOBAL") {
    return [
      lt("通用零售：适合跨境或市场混合数据，包含返校季、Singles Day、圣诞季等宽泛活动。", "General retail: suitable for cross-border or mixed-market data, with broad events such as back-to-school, Singles Day, and holiday season."),
      lt("如果你知道主要国家，优先切换到具体市场；混合市场可能需要按国家或渠道分组后分别预测。", "If you know the dominant country, prefer a specific market. Mixed markets often need country/channel forecasting before aggregation."),
      lt("调参建议：先用较低 holidays prior，确认活动确实稳定影响销售后再提高。", "Tuning: start with a low holidays prior and raise it only after confirming events have stable sales impact."),
    ];
  }
  return [
    lt("当前未使用节假日模板，模型只依赖趋势和季节性解释销售变化。", "No holiday template is enabled. The model explains sales changes only with trend and seasonality."),
    lt("如果数据里存在大促、法定假日、财年节点或区域性消费节，建议选择目标市场或录入自定义活动。", "If the data contains campaigns, public holidays, fiscal events, or regional shopping moments, choose a target market or add custom events."),
    lt("调参建议：没有节假日特征时，异常峰值可能被趋势变化点或季节项错误吸收。", "Tuning: without holiday features, abnormal peaks may be absorbed incorrectly by changepoints or seasonality."),
  ];
}

function holidayTemplateNames(country) {
  if (country === "none") return [];
  const events = buildHolidayEvents(country, new Date(2026, 0, 1), new Date(2027, 11, 31));
  const seen = new Set();
  const names = [];
  events.forEach((event) => {
    const name = localizedEventName(event.name);
    if (!name || seen.has(name)) return;
    seen.add(name);
    names.push(name);
  });
  return names;
}

function renderHolidayTemplatePreview(country) {
  const names = holidayTemplateNames(country);
  if (!names.length) {
    els.holidayTemplatePreview.innerHTML = `<span class="muted">${escapeHtml(t("static.noHolidayTemplate"))}</span>`;
    return;
  }
  els.holidayTemplatePreview.innerHTML = names
    .map((name) => `<span>${escapeHtml(name)}</span>`)
    .concat(`<span class="muted">${escapeHtml(t("static.customEventsOnlyFillMissing"))}</span>`)
    .join("");
}

function renderHolidayDatePreview(result) {
  const start = result.future[0]?.ds;
  const end = result.future[result.future.length - 1]?.ds;
  if (!start || !end) {
    els.holidayDatePreview.innerHTML = "";
    return;
  }

  const templateNames = holidayTemplateNames(result.params.holidayCountry);
  const templateBody = templateNames.length
    ? templateNames.map((name) => `<span>${escapeHtml(name)}</span>`).join("")
    : `<span class="muted">${escapeHtml(t("static.noRegionalTemplateCurrent"))}</span>`;
  const seen = new Set();
  const events = result.params.events
    .filter((event) => event.date && event.date >= start && event.date <= end)
    .sort((a, b) => a.date - b.date)
    .filter((event) => {
      const key = `${formatDate(event.date)}-${localizedEventName(event.name)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  const body = events.length
    ? events.map((event) => `<span>${formatDate(event.date)} ${escapeHtml(localizedEventName(event.name))}</span>`).join("")
    : `<span class="muted">${escapeHtml(t("static.noHolidayEventsMatched"))}</span>`;
  els.holidayDatePreview.innerHTML = `<strong>${escapeHtml(t("static.builtInHolidayEvents"))}</strong>${templateBody}<strong>${escapeHtml(t("static.matchedForecastDates", { count: events.length }))}</strong>${body}`;
}

function renderProcessingAudit(result) {
  const data = state.dataAudit || {};
  const model = result.modelAudit || { fittedClips: [], futureClips: [], clippingFloor: null };
  const aggregationSamples = (data.aggregationSamples || []).length
    ? data.aggregationSamples.map((item) => `${item.date}: ${item.count} ${lt("行", "rows")} -> ${formatNumber(item.value, 0)}`).join("<br>")
    : `<span class="muted">${escapeHtml(lt("没有同日期多行聚合", "No same-date multi-row aggregation"))}</span>`;
  const missingDateSamples = (data.missingDateSamples || []).length
    ? data.missingDateSamples.join("<br>")
    : `<span class="muted">${escapeHtml(lt("没有发现日期缺口", "No date gaps detected"))}</span>`;
  const fittedClips = model.fittedClips.length
    ? model.fittedClips
        .slice(0, 5)
        .map((item) => `${formatDate(item.date)}: ${formatNumber(item.raw, 0)} -> ${formatNumber(item.value, 0)}`)
        .join("<br>")
    : `<span class="muted">${escapeHtml(lt("历史拟合没有被下限填补", "No historical fitted points were raised by the floor"))}</span>`;
  const futureClips = model.futureClips.length
    ? model.futureClips
        .slice(0, 5)
        .map((item) => {
          const fields = item.fields.map((field) => `${field.label} ${formatNumber(field.raw, 0)} -> ${formatNumber(field.value, 0)}`).join("；");
          return `${formatDate(item.date)}: ${fields}`;
        })
        .join("<br>")
    : `<span class="muted">${escapeHtml(lt("未来预测没有被下限填补", "No future forecast points were raised by the floor"))}</span>`;
  const moreFuture = model.futureClips.length > 5
    ? `<br><span class="muted">${escapeHtml(lt(`另有 ${model.futureClips.length - 5} 期被下限填补`, `${model.futureClips.length - 5} more periods were raised by the floor`))}</span>`
    : "";
  const seasonality = model.seasonality || { activeLabels: [], disabled: [], notes: [] };
  const activeSeasonality = localizedSeasonalityActive(seasonality) || t("common.none");
  const disabledSeasonality = localizedSeasonalityDisabled(seasonality) || lt("没有被禁用的季节项", "No disabled seasonality terms");
  const cappedSeasonality = localizedSeasonalityNotes(seasonality) || lt("没有自动降阶", "No automatic order reduction");
  const metricDiagnosis = data.metricDiagnosis;
  const metricCard = metricDiagnosis
    ? `<div class="audit-card">
      <strong>${escapeHtml(lt("指标口径识别", "Metric Intent Diagnosis"))}</strong>
      <span>${escapeHtml(metricDiagnosis.recommendation)}</span>
      <span>${escapeHtml(lt("当前预测列", "Selected forecast column"))}${fieldSeparator()}${escapeHtml(metricDiagnosis.selected || "-")}</span>
      <span>${escapeHtml(lt("销量列", "Quantity column"))}${fieldSeparator()}${escapeHtml(metricDiagnosis.quantityColumn || t("common.notRecognized"))}</span>
      <span>${escapeHtml(lt("收益列", "Revenue column"))}${fieldSeparator()}${escapeHtml(metricDiagnosis.revenueColumn || t("common.notRecognized"))}</span>
      <span>${escapeHtml(lt("单价列", "Unit price column"))}${fieldSeparator()}${escapeHtml(metricDiagnosis.priceColumn || t("common.notRecognized"))}</span>
      ${
        metricDiagnosis.weightedUnitPrice !== null
          ? `<span>${escapeHtml(lt("历史加权单价", "Historical weighted unit price"))}${fieldSeparator()}${formatNumber(metricDiagnosis.weightedUnitPrice, 2)}</span>`
          : metricDiagnosis.averagePrice !== null
            ? `<span>${escapeHtml(lt("历史平均单价", "Historical average unit price"))}${fieldSeparator()}${formatNumber(metricDiagnosis.averagePrice, 2)}</span>`
            : ""
      }
      ${metricDiagnosis.zeroQuantityRevenueRows ? `<span class="muted">${escapeHtml(lt("注意", "Notice"))}${fieldSeparator()}${formatNumber(metricDiagnosis.zeroQuantityRevenueRows, 0)} ${escapeHtml(lt("行销量为 0 但收益非 0", "rows have zero quantity but non-zero revenue"))}</span>` : ""}
    </div>`
    : "";

  els.processingAudit.innerHTML = [
    `<div class="audit-card">
      <strong>${escapeHtml(lt("导入与过滤", "Import and Filtering"))}</strong>
      <span>${escapeHtml(lt("源数据", "Source rows"))}${fieldSeparator()}${formatNumber(data.sourceRows || 0, 0)} ${escapeHtml(lt("行", "rows"))}</span>
      <span>${escapeHtml(lt("分组过滤", "Filtered by dimension"))}${fieldSeparator()}${formatNumber(data.groupSkipped || 0, 0)} ${escapeHtml(lt("行", "rows"))}</span>
      <span>${escapeHtml(lt("无效日期", "Invalid dates"))}${fieldSeparator()}${formatNumber(data.invalidDate || 0, 0)} ${escapeHtml(lt("行", "rows"))}</span>
      <span>${escapeHtml(lt("无效销售额", "Invalid metric values"))}${fieldSeparator()}${formatNumber(data.invalidValue || 0, 0)} ${escapeHtml(lt("行", "rows"))}</span>
      <span>${escapeHtml(lt("有效参与", "Valid rows used"))}${fieldSeparator()}${formatNumber(data.validRows || 0, 0)} ${escapeHtml(lt("行", "rows"))}</span>
    </div>`,
    `<div class="audit-card">
      <strong>${escapeHtml(lt("同日期聚合", "Same-date Aggregation"))}</strong>
      <span>${escapeHtml(lt("输出时间点", "Output time points"))}${fieldSeparator()}${formatNumber(data.outputRows || result.records.length, 0)} ${escapeHtml(lt("期", "periods"))}</span>
      <span>${escapeHtml(lt("发生聚合日期", "Aggregated dates"))}${fieldSeparator()}${formatNumber(data.aggregatedDates || 0, 0)} ${escapeHtml(lt("个", "dates"))}</span>
      <span>${aggregationSamples}</span>
    </div>`,
    `<div class="audit-card">
      <strong>${escapeHtml(lt("日期缺口", "Date Gaps"))}</strong>
      <span>${escapeHtml(lt("缺失自然日", "Missing calendar days"))}${fieldSeparator()}${formatNumber(data.missingDateCount || 0, 0)} ${escapeHtml(lt("天", "days"))}</span>
      <span>${escapeHtml(lt("最大断层", "Largest gap"))}${fieldSeparator()}${formatNumber(data.maxGapDays || 0, 0)} ${escapeHtml(lt("天", "days"))}</span>
      <span>${missingDateSamples}</span>
    </div>`,
    `<div class="audit-card">
      <strong>${escapeHtml(lt("削峰填谷", "Peak Smoothing and Valley Filling"))}</strong>
      <span class="muted">${escapeHtml(lt("未启用自动削峰，也未做异常值平滑替换。", "Automatic peak smoothing is not enabled, and no outlier smoothing replacement was applied."))}</span>
      <span>${escapeHtml(lt("当前只启用业务下限裁剪", "Current business floor clipping"))}${fieldSeparator()}${model.clippingFloor === null ? t("common.disabled") : `>= ${formatNumber(model.clippingFloor, 0)}`}</span>
    </div>`,
    `<div class="audit-card">
      <strong>${escapeHtml(lt("季节性审计", "Seasonality Audit"))}</strong>
      <span>${escapeHtml(lt("实际生效", "Active"))}${fieldSeparator()}${escapeHtml(activeSeasonality)}</span>
      <span>${disabledSeasonality}</span>
      <span>${cappedSeasonality}</span>
    </div>`,
    `<div class="audit-card">
      <strong>${escapeHtml(lt("下限填补样例", "Floor Fill Examples"))}</strong>
      <span>${escapeHtml(lt("历史拟合", "Historical fit"))}${fieldSeparator()}${formatNumber(model.fittedClips.length, 0)} ${escapeHtml(lt("点", "points"))}</span>
      <span>${fittedClips}</span>
      <span>${escapeHtml(lt("未来预测", "Future forecast"))}${fieldSeparator()}${formatNumber(model.futureClips.length, 0)} ${escapeHtml(lt("期", "periods"))}</span>
      <span>${futureClips}${moreFuture}</span>
    </div>`,
    metricCard,
  ].join("");
}

function renderModelComparison(result) {
  const comparison = result.modelComparison;
  if (!comparison || !comparison.models.length) {
    els.modelComparisonCaption.textContent = t("static.historyTooShortBacktest");
    els.modelComparison.innerHTML = "";
    return;
  }

  const futureById = new Map((result.futureModelForecasts || []).map((model) => [model.id, model]));
  const fitById = new Map((result.historicalModelFits || []).map((model) => [model.id, model]));
  const recommendation = displayRecommendation(result, comparison);
  const recommended = recommendation.model;
  const fit = recommended ? fitById.get(recommended.id) : null;
  els.modelComparisonCaption.textContent = recommended
    ? recommendation.source === "backend"
      ? `${lt("后端实验推荐", "Backend experiment recommends")} ${recommended.name}${fieldSeparator()}${metricLine(recommended.metrics, comparison.holdoutSize)}`
      : `${lt("本地回测推荐", "Local backtest recommends")} ${recommended.name}${fieldSeparator()}${metricLine(recommended.metrics, comparison.holdoutSize)}`
    : lt(
      `用最后 ${comparison.holdoutSize} 期回测：${formatDate(comparison.actualStart)} 至 ${formatDate(comparison.actualEnd)}`,
      `Backtesting on the last ${comparison.holdoutSize} periods: ${formatDate(comparison.actualStart)} to ${formatDate(comparison.actualEnd)}`,
    );
  const decision = recommended
    ? `<div class="model-decision">
        <div>
          <strong>${escapeHtml(lt("建议使用", "Recommended"))} ${escapeHtml(recommended.name)}</strong>
          <span>${escapeHtml(recommendation.source === "backend"
            ? lt("依据：后端持久化实验的模型排名。状态栏、推荐卡片和下载按钮都使用这一口径。", "Basis: the persisted backend experiment ranking. Status, recommendation card, and download button all use this same source.")
            : lt("依据：前端本地留出回测 WAPE 最低。后端实验完成后会自动切换到后端持久化推荐。", "Basis: the lowest WAPE in the local holdout backtest. After backend sync completes, this switches to the persisted backend recommendation."))}</span>
        </div>
        <div class="decision-metrics">
          <span>WAPE <b>${recommended.metrics ? `${formatNumber(recommended.metrics.wape * 100, 1)}%` : "-"}</b></span>
          <span>MAPE <b>${recommended.metrics ? `${formatNumber(recommended.metrics.mape * 100, 1)}%` : "-"}</b></span>
          <span>RMSE <b>${recommended.metrics ? formatNumber(recommended.metrics.rmse, 0) : "-"}</b></span>
          <span>${escapeHtml(lt("全量拟合", "Full fit"))} <b>${fit?.metrics ? `${formatNumber(fit.metrics.mape * 100, 1)}%` : "-"}</b></span>
        </div>
        <div class="model-actions">
          <button class="mini-btn primary" type="button" data-model-download="${escapeHtml(recommended.id)}">${escapeHtml(lt("下载推荐模型数据", "Download recommended model data"))}</button>
          <button class="mini-btn" type="button" data-download-all-models="true">${escapeHtml(lt("下载全部模型对比", "Download all model comparison"))}</button>
        </div>
      </div>`
    : "";
  const rows = comparison.models
    .map((model) => {
      const future = futureById.get(model.id);
      const fit = fitById.get(model.id);
      if (!model.metrics) {
        return `<tr>
          <td><strong>${escapeHtml(model.name)}</strong></td>
          <td colspan="6" class="model-note">${escapeHtml(model.error || lt("无法完成回测", "Unable to complete backtest"))}</td>
          <td></td>
        </tr>`;
      }
      const isRecommended = recommended?.id === model.id;
      return `<tr class="${isRecommended ? "best" : ""}">
        <td>
          <strong>${escapeHtml(model.name)} ${isRecommended ? `<em>${escapeHtml(lt("推荐", "Recommended"))}</em>` : ""}</strong>
          <small>${escapeHtml(modelApplicabilityNote(model.id, model.note))}</small>
        </td>
        <td>${formatNumber(model.metrics.wape * 100, 1)}%</td>
        <td>${formatNumber(model.metrics.mape * 100, 1)}%</td>
        <td>${formatNumber(model.metrics.mae, 0)}</td>
        <td>${formatNumber(model.metrics.rmse, 0)}</td>
        <td>${fit?.metrics ? `${formatNumber(fit.metrics.mape * 100, 1)}%` : "-"}</td>
        <td>${future && future.total !== null ? formatNumber(future.total, 0) : "-"}</td>
        <td><button class="mini-btn" type="button" data-model-download="${escapeHtml(model.id)}">${escapeHtml(lt("下载", "Download"))}</button></td>
      </tr>`;
    })
    .join("");
  els.modelComparison.innerHTML = `${decision}
    <div class="model-leaderboard">
      <table>
        <thead>
          <tr>
            <th>${escapeHtml(lt("模型与适用性", "Model and fit"))}</th>
            <th>WAPE</th>
            <th>MAPE</th>
            <th>MAE</th>
            <th>RMSE</th>
            <th>${escapeHtml(lt("全量拟合", "Full fit"))}</th>
            <th>${escapeHtml(lt("未来合计", "Future total"))}</th>
            <th>${escapeHtml(lt("导出", "Export"))}</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function displayRecommendation(result, comparison) {
  const backendId = result.backendRecommendation?.id;
  if (backendId) {
    return {
      source: "backend",
      model: (comparison?.models || []).find((model) => model.id === backendId) || {
        id: backendId,
        name: modelName(backendId),
        metrics: null,
        note: lt("后端实验推荐模型", "Backend experiment recommendation"),
      },
    };
  }
  return {
    source: "local",
    model: recommendedModelFromComparison(comparison),
  };
}

function metricLine(metrics, holdoutSize) {
  if (!metrics) return lt("后端返回了推荐模型，但本地没有对应回测指标", "The backend returned a recommended model, but no matching local backtest metrics are available.");
  return lt(
    `最后 ${holdoutSize} 期回测 WAPE ${formatNumber(metrics.wape * 100, 1)}%，MAPE ${formatNumber(metrics.mape * 100, 1)}%`,
    `last ${holdoutSize} holdout periods: WAPE ${formatNumber(metrics.wape * 100, 1)}%, MAPE ${formatNumber(metrics.mape * 100, 1)}%`,
  );
}

function recommendedModelFromComparison(comparison) {
  return (comparison?.models || [])
    .filter((model) => model.metrics)
    .slice()
    .sort((a, b) => {
      const wape = a.metrics.wape - b.metrics.wape;
      if (Math.abs(wape) > 0.002) return wape;
      const mape = a.metrics.mape - b.metrics.mape;
      if (Math.abs(mape) > 0.002) return mape;
      return a.metrics.rmse - b.metrics.rmse;
    })[0] || null;
}

function makePenalties(kinds, params) {
  const trend = 0.05;
  const changepoint = 8 / Math.max(0.001, params.changepointPriorScale);
  const seasonality = 8 / Math.max(0.001, params.seasonalityPriorScale);
  const holiday = 8 / Math.max(0.001, params.holidayPriorScale);
  return kinds.map((kind) => {
    if (kind === "intercept") return 0;
    if (kind === "trend") return trend;
    if (kind === "changepoint") return changepoint;
    if (kind === "seasonality") return seasonality;
    if (kind === "holiday") return holiday;
    return 1;
  });
}

function transformTarget(value, params) {
  if (params.growth === "logistic") {
    const floor = params.floor;
    const cap = Math.max(params.cap, floor + 1);
    const ratio = Math.min(0.999999, Math.max(0.000001, (value - floor) / (cap - floor)));
    return Math.log(ratio / (1 - ratio));
  }
  if (params.seasonalityMode === "multiplicative") return Math.log1p(Math.max(0, value));
  return value;
}

function inverseTarget(value, params) {
  if (params.growth === "logistic") {
    const floor = params.floor;
    const cap = Math.max(params.cap, floor + 1);
    const ratio = 1 / (1 + Math.exp(-value));
    return floor + ratio * (cap - floor);
  }
  if (params.seasonalityMode === "multiplicative") return Math.expm1(value);
  return value;
}

function businessFloor(params) {
  if (!params.clipZero) return null;
  return Math.max(0, Number.isFinite(params.floor) ? params.floor : 0);
}

function applyBusinessBounds(value, params) {
  const floor = businessFloor(params);
  if (floor === null) return value;
  return Math.max(floor, value);
}

function boundedPrediction(value, params) {
  const bounded = applyBusinessBounds(value, params);
  return {
    raw: value,
    value: bounded,
    adjusted: bounded !== value,
  };
}

function optionalNumber(value) {
  if (String(value).trim() === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function rangeScale(value) {
  return Math.max(0.01, Number(value) / 100);
}

function trainForecast(records, params) {
  const cadence = inferCadence(records);
  const forecastCadence = resolveForecastCadence(cadence, params);
  const stepDays = cadence.stepDays;
  const startDate = records[0].ds;
  const lastDate = records[records.length - 1].ds;
  const futureEndDate = addPeriod(lastDate, params.horizon, forecastCadence);
  const maxY = Math.max(...records.map((row) => row.y));
  params.historyCadence = cadence;
  params.cadence = cadence;
  params.cap = Number.isFinite(params.cap) ? params.cap : maxY * 1.35;
  params.floor = Number.isFinite(params.floor) ? params.floor : 0;
  params.events = buildHolidayEvents(params.holidayCountry, startDate, futureEndDate).concat(params.customEvents);

  const historyPeriods = Math.max(1, (records[records.length - 1].ds - startDate) / 86400000 / stepDays);
  const spanDays = Math.max(1, (records[records.length - 1].ds - startDate) / 86400000);
  params.effectiveSeasonality = resolveSeasonality(params, records, spanDays);
  const cpCount = Math.min(params.changepoints, Math.max(0, records.length - 3));
  const cpLimit = historyPeriods * params.changepointRange;
  const changepoints = Array.from({ length: cpCount }, (_, i) => ((i + 1) / (cpCount + 1)) * cpLimit);

  const rawSpecs = records.map((row) => buildFeatureRow(row.ds, startDate, stepDays, changepoints, params, true));
  const rawX = rawSpecs.map((spec) => spec.values);
  const y = records.map((row) => transformTarget(row.y, params));
  const standardized = standardizeMatrix(rawX);
  const penalties = makePenalties(rawSpecs[0].kinds, params);
  const beta = ridgeRegression(standardized.matrix, y, penalties);
  const modelAudit = {
    clippingFloor: businessFloor(params),
    fittedClips: [],
    futureClips: [],
    seasonality: params.effectiveSeasonality,
  };

  const fitted = records.map((row) => {
    const x = applyStandardization(buildFeatureRow(row.ds, startDate, stepDays, changepoints, params), standardized.means, standardized.stds);
    const bounded = boundedPrediction(inverseTarget(dot(x, beta), params), params);
    if (bounded.adjusted) {
      modelAudit.fittedClips.push({
        date: row.ds,
        raw: bounded.raw,
        value: bounded.value,
      });
    }
    return { ds: row.ds, y: row.y, yhat: bounded.value };
  });

  const residuals = records.map((row, index) => y[index] - dot(standardized.matrix[index], beta));
  const residualSd = Math.sqrt(residuals.reduce((sum, value) => sum + value ** 2, 0) / Math.max(1, residuals.length - 2)) || 0;
  const z = quantileForInterval(params.intervalWidth);
  const future = [];
  params.cadence = forecastCadence;

  for (let i = 1; i <= params.horizon; i += 1) {
    const ds = addPeriod(lastDate, i, forecastCadence);
    const x = applyStandardization(buildFeatureRow(ds, startDate, stepDays, changepoints, params), standardized.means, standardized.stds);
    const transformedYhat = dot(x, beta);
    const recommended = boundedPrediction(inverseTarget(transformedYhat, params), params);
    const low = boundedPrediction(inverseTarget(transformedYhat - z * residualSd, params), params);
    const high = boundedPrediction(inverseTarget(transformedYhat + z * residualSd, params), params);
    const adjustedFields = [
      [lt("低位", "Low"), low],
      [lt("推荐位", "Recommended"), recommended],
      [lt("高位", "High"), high],
    ].filter(([, item]) => item.adjusted);
    if (adjustedFields.length) {
      modelAudit.futureClips.push({
        date: ds,
        period: i,
        fields: adjustedFields.map(([label, item]) => ({
          label,
          raw: item.raw,
          value: item.value,
        })),
      });
    }
    future.push({
      ds,
      period: i,
      daysAhead: Math.round((ds - lastDate) / 86400000),
      events: activeEventsForDate(ds, params),
      yhat: recommended.value,
      yhatLower: low.value,
      yhatUpper: high.value,
    });
  }

  const mapeRows = fitted.filter((row) => row.y !== 0);
  const mape = mapeRows.length ? fitted.reduce((sum, row) => {
    if (row.y === 0) return sum;
    return sum + Math.abs((row.y - row.yhat) / row.y);
  }, 0) / mapeRows.length : 0;

  return { records, fitted, future, residualSd, mape, stepDays, cadence: forecastCadence, historyCadence: cadence, changepoints, params, modelAudit };
}

function cloneParams(params) {
  return {
    ...params,
    customEvents: (params.customEvents || []).map((event) => ({ ...event, date: new Date(event.date) })),
    events: [],
    effectiveSeasonality: null,
    cadence: null,
    historyCadence: null,
  };
}

function trainSelectedModel(records, params) {
  if (params.forecastModel === "ets") return trainSimpleModel(records, params, "ets");
  if (params.forecastModel === "sarima") return trainSimpleModel(records, params, "sarima");
  if (params.forecastModel === "featureMl") return trainSimpleModel(records, params, "featureMl");
  if (params.forecastModel === "neuralProphet") return trainSimpleModel(records, params, "neuralProphet");
  if (params.forecastModel === "nbeats") return trainSimpleModel(records, params, "nbeats");
  if (params.forecastModel === "movingAverage") return trainSimpleModel(records, params, "movingAverage");
  if (params.forecastModel === "seasonalNaive") return trainSimpleModel(records, params, "seasonalNaive");
  return trainForecast(records, params);
}

function compareModels(records, params) {
  if (records.length < 14) return { holdoutSize: 0, models: [] };
  const holdoutSize = Math.min(Math.max(3, Math.round(records.length * 0.2)), records.length - 8);
  const train = records.slice(0, records.length - holdoutSize);
  const actual = records.slice(records.length - holdoutSize);
  const actualValues = actual.map((row) => row.y);
  const cadence = inferCadence(train);
  const candidates = [
    {
      id: "prophet",
      name: "Prophet-like",
      note: modelApplicabilityNote("prophet"),
      values: () => trainForecast(train, { ...cloneParams(params), forecastCadenceUnit: "auto", horizon: holdoutSize }).future.map((row) => row.yhat),
    },
    {
      id: "ets",
      name: "ETS",
      note: modelApplicabilityNote("ets"),
      values: () => etsForecast(train, holdoutSize, params),
    },
    {
      id: "sarima",
      name: "SARIMA-like",
      note: modelApplicabilityNote("sarima"),
      values: () => sarimaLikeForecast(train, holdoutSize, cadence, params),
    },
    {
      id: "featureMl",
      name: "LightGBM/XGBoost-like",
      note: modelApplicabilityNote("featureMl"),
      values: () => featureMlForecast(train, holdoutSize, cadence, params),
    },
    {
      id: "neuralProphet",
      name: "NeuralProphet-like",
      note: modelApplicabilityNote("neuralProphet"),
      values: () => neuralProphetLikeForecast(train, holdoutSize, cadence, params),
    },
    {
      id: "nbeats",
      name: "N-BEATS-like",
      note: modelApplicabilityNote("nbeats"),
      values: () => nbeatsLikeForecast(train, holdoutSize, cadence, params),
    },
    {
      id: "movingAverage",
      name: "Moving Avg",
      note: modelApplicabilityNote("movingAverage"),
      values: () => movingAverageForecast(train, holdoutSize, cadence, params.movingAverageWindow),
    },
    {
      id: "seasonalNaive",
      name: "Seasonal Naive",
      note: modelApplicabilityNote("seasonalNaive"),
      values: () => seasonalNaiveForecast(train, holdoutSize, cadence, params.seasonalNaiveLag),
    },
  ];

  const models = candidates.map((candidate) => {
    try {
      const forecast = candidate.values().map((value) => applyBusinessBounds(value, params));
      return {
        ...candidate,
        forecast,
        metrics: scoreForecast(actualValues, forecast),
      };
    } catch (error) {
      return {
        ...candidate,
        forecast: [],
        metrics: null,
        error: error.message,
      };
    }
  });

  const ranked = models
    .filter((model) => model.metrics)
    .sort((a, b) => a.metrics.wape - b.metrics.wape)
    .map((model, index) => ({ ...model, rank: index + 1 }));
  const rankedById = new Map(ranked.map((model) => [model.id, model]));
  return {
    holdoutSize,
    actualStart: actual[0].ds,
    actualEnd: actual[actual.length - 1].ds,
    actual: actual.map((row, index) => ({ ds: row.ds, period: index + 1, value: row.y })),
    models: models.map((model) => rankedById.get(model.id) || model),
  };
}

function modelColor(id) {
  if (id === "prophet") return "#d99a22";
  if (id === "ets") return "#2563eb";
  if (id === "sarima") return "#7c3aed";
  if (id === "featureMl") return "#0f766e";
  if (id === "neuralProphet") return "#db2777";
  if (id === "nbeats") return "#0891b2";
  if (id === "movingAverage") return "#e4572e";
  if (id === "seasonalNaive") return "#64748b";
  return "#33424e";
}

function modelCandidates(params, horizon, cadence, records) {
  return [
    {
      id: "prophet",
      name: modelName("prophet"),
      values: () => trainForecast(records, { ...cloneParams(params), horizon }).future.map((row) => row.yhat),
    },
    {
      id: "ets",
      name: modelName("ets"),
      values: () => etsForecast(records, horizon, params),
    },
    {
      id: "sarima",
      name: modelName("sarima"),
      values: () => sarimaLikeForecast(records, horizon, cadence, params),
    },
    {
      id: "featureMl",
      name: modelName("featureMl"),
      values: () => featureMlForecast(records, horizon, cadence, params),
    },
    {
      id: "neuralProphet",
      name: modelName("neuralProphet"),
      values: () => neuralProphetLikeForecast(records, horizon, cadence, params),
    },
    {
      id: "nbeats",
      name: modelName("nbeats"),
      values: () => nbeatsLikeForecast(records, horizon, cadence, params),
    },
    {
      id: "movingAverage",
      name: modelName("movingAverage"),
      values: () => movingAverageForecast(records, horizon, cadence, params.movingAverageWindow),
    },
    {
      id: "seasonalNaive",
      name: modelName("seasonalNaive"),
      values: () => seasonalNaiveForecast(records, horizon, cadence, params.seasonalNaiveLag),
    },
  ];
}

function compareFutureModels(records, params) {
  const modelCadence = inferCadence(records);
  const forecastCadence = resolveForecastCadence(modelCadence, params);
  const lastDate = records[records.length - 1].ds;
  return modelCandidates(params, params.horizon, modelCadence, records).map((candidate) => {
    try {
      const values = candidate.values().map((value) => applyBusinessBounds(value, params));
      return {
        id: candidate.id,
        name: candidate.name,
        color: modelColor(candidate.id),
        total: values.reduce((sum, value) => sum + value, 0),
        values: values.map((value, index) => ({
          ds: addPeriod(lastDate, index + 1, forecastCadence),
          period: index + 1,
          value,
        })),
      };
    } catch (error) {
      return {
        id: candidate.id,
        name: candidate.name,
        color: modelColor(candidate.id),
        total: null,
        values: [],
        error: error.message,
      };
    }
  });
}

function compareHistoricalFits(records, params) {
  if (records.length < 3) return [];
  const actualValues = records.map((row) => row.y);
  const candidates = [
    {
      id: "prophet",
      name: "Prophet-like",
      train: () => trainForecast(records, { ...cloneParams(params), forecastCadenceUnit: "auto", horizon: 1 }),
    },
    {
      id: "ets",
      name: "ETS",
      train: () => trainSimpleModel(records, { ...cloneParams(params), forecastCadenceUnit: "auto", horizon: 1 }, "ets"),
    },
    {
      id: "sarima",
      name: "SARIMA-like",
      train: () => trainSimpleModel(records, { ...cloneParams(params), forecastCadenceUnit: "auto", horizon: 1 }, "sarima"),
    },
    {
      id: "featureMl",
      name: "LightGBM/XGBoost-like",
      train: () => trainSimpleModel(records, { ...cloneParams(params), forecastCadenceUnit: "auto", horizon: 1 }, "featureMl"),
    },
    {
      id: "neuralProphet",
      name: "NeuralProphet-like",
      train: () => trainSimpleModel(records, { ...cloneParams(params), forecastCadenceUnit: "auto", horizon: 1 }, "neuralProphet"),
    },
    {
      id: "nbeats",
      name: "N-BEATS-like",
      train: () => trainSimpleModel(records, { ...cloneParams(params), forecastCadenceUnit: "auto", horizon: 1 }, "nbeats"),
    },
    {
      id: "movingAverage",
      name: "Moving Avg",
      train: () => trainSimpleModel(records, { ...cloneParams(params), forecastCadenceUnit: "auto", horizon: 1 }, "movingAverage"),
    },
    {
      id: "seasonalNaive",
      name: "Seasonal Naive",
      train: () => trainSimpleModel(records, { ...cloneParams(params), forecastCadenceUnit: "auto", horizon: 1 }, "seasonalNaive"),
    },
  ];

  return candidates.map((candidate) => {
    try {
      const trained = candidate.train();
      const values = trained.fitted.map((row, index) => {
        const actual = records[index]?.y ?? row.y;
        return {
          ds: row.ds,
          period: index + 1,
          value: row.yhat,
          actual,
          errorPct: actual ? Math.abs((actual - row.yhat) / actual) * 100 : null,
        };
      });
      return {
        id: candidate.id,
        name: candidate.name,
        color: modelColor(candidate.id),
        values,
        metrics: scoreForecast(actualValues, values.map((row) => row.value)),
      };
    } catch (error) {
      return {
        id: candidate.id,
        name: candidate.name,
        color: modelColor(candidate.id),
        values: [],
        metrics: null,
        error: error.message,
      };
    }
  });
}

function scoreForecast(actual, forecast) {
  const n = Math.min(actual.length, forecast.length);
  let abs = 0;
  let sq = 0;
  let pct = 0;
  let pctCount = 0;
  let actualTotal = 0;
  for (let i = 0; i < n; i += 1) {
    const error = forecast[i] - actual[i];
    abs += Math.abs(error);
    sq += error ** 2;
    actualTotal += Math.abs(actual[i]);
    if (actual[i] !== 0) {
      pct += Math.abs(error / actual[i]);
      pctCount += 1;
    }
  }
  return {
    mae: abs / Math.max(1, n),
    rmse: Math.sqrt(sq / Math.max(1, n)),
    mape: pctCount ? pct / pctCount : 0,
    wape: actualTotal ? abs / actualTotal : 0,
  };
}

function modelLabel(model) {
  return modelName(model);
}

function trainSimpleModel(records, params, model) {
  const cadence = inferCadence(records);
  const forecastCadence = resolveForecastCadence(cadence, params);
  const lastDate = records[records.length - 1].ds;
  const futureEndDate = addPeriod(lastDate, params.horizon, forecastCadence);
  const usesEvents = (model === "featureMl" && params.featureEvents) || (model === "neuralProphet" && params.neuralEvents);
  const simpleEvents = usesEvents ? buildHolidayEvents(params.holidayCountry, records[0].ds, futureEndDate).concat(params.customEvents || []) : [];
  const resultParams = {
    ...params,
    events: simpleEvents,
    historyCadence: cadence,
    cadence: forecastCadence,
    effectiveSeasonality: { activeLabels: [], disabled: [], notes: [] },
  };
  const residuals = [];
  const fitted = records.map((row, index) => {
    const history = records.slice(0, index);
    const raw = index === 0 ? row.y : simpleModelForecast(history, 1, cadence, params, model)[0];
    const bounded = boundedPrediction(raw, params);
    residuals.push(row.y - bounded.value);
    return { ds: row.ds, y: row.y, yhat: bounded.value };
  });
  const residualSd = Math.sqrt(residuals.slice(1).reduce((sum, value) => sum + value ** 2, 0) / Math.max(1, residuals.length - 2)) || 0;
  const z = quantileForInterval(params.intervalWidth);
  const rawFuture = simpleModelForecast(records, params.horizon, cadence, params, model);
  const future = rawFuture.map((raw, index) => {
    const ds = addPeriod(lastDate, index + 1, forecastCadence);
    const recommended = boundedPrediction(raw, params);
    const low = boundedPrediction(raw - z * residualSd, params);
    const high = boundedPrediction(raw + z * residualSd, params);
    return {
      ds,
      period: index + 1,
      daysAhead: Math.round((ds - lastDate) / 86400000),
      events: activeEventsForDate(ds, resultParams),
      yhat: recommended.value,
      yhatLower: low.value,
      yhatUpper: high.value,
    };
  });
  const mapeRows = fitted.filter((row) => row.y !== 0);
  const mape = mapeRows.length ? fitted.reduce((sum, row) => {
    if (row.y === 0) return sum;
    return sum + Math.abs((row.y - row.yhat) / row.y);
  }, 0) / mapeRows.length : 0;
  return {
    records,
    fitted,
    future,
    residualSd,
    mape,
    stepDays: forecastCadence.stepDays,
    cadence: forecastCadence,
    historyCadence: cadence,
    changepoints: [],
    params: resultParams,
    modelName: modelLabel(model),
    modelAudit: {
      clippingFloor: businessFloor(params),
      fittedClips: [],
      futureClips: [],
      seasonality: { activeLabels: [], disabled: [], notes: [], modelWithoutProphetSeasonality: model },
    },
  };
}

function simpleModelForecast(records, horizon, cadence, params, model) {
  if (model === "ets") return etsForecast(records, horizon, params);
  if (model === "sarima") return sarimaLikeForecast(records, horizon, cadence, params);
  if (model === "featureMl") return featureMlForecast(records, horizon, cadence, params);
  if (model === "neuralProphet") return neuralProphetLikeForecast(records, horizon, cadence, params);
  if (model === "nbeats") return nbeatsLikeForecast(records, horizon, cadence, params);
  if (model === "seasonalNaive") return seasonalNaiveForecast(records, horizon, cadence, params.seasonalNaiveLag);
  return movingAverageForecast(records, horizon, cadence, params.movingAverageWindow);
}

function movingAverageForecast(records, horizon, cadence, configuredWindow = 0) {
  const autoWindow = cadence.kind === "month" ? 3 : 7;
  const windowSize = Math.min(records.length, Math.max(1, Number(configuredWindow) || autoWindow));
  const values = records.map((row) => row.y);
  const output = [];
  for (let i = 0; i < horizon; i += 1) {
    const recent = values.slice(-windowSize);
    const next = recent.reduce((sum, value) => sum + value, 0) / Math.max(1, recent.length);
    output.push(next);
    values.push(next);
  }
  return output;
}

function seasonalNaiveForecast(records, horizon, cadence, configuredLag = 0) {
  const values = records.map((row) => row.y);
  let lag = Math.max(0, Number(configuredLag) || 0);
  if (!lag) {
    lag = 1;
    if (cadence.kind === "month" && values.length >= 12) lag = 12;
    else if (cadence.kind === "day" && cadence.stepDays <= 1 && values.length >= 7) lag = 7;
    else if (cadence.kind === "day" && cadence.stepDays % 7 === 0 && values.length >= 4) lag = 4;
  }
  lag = Math.min(Math.max(1, lag), values.length);
  const output = [];
  for (let i = 0; i < horizon; i += 1) {
    const sourceIndex = values.length - lag;
    const next = values[Math.max(0, sourceIndex)];
    output.push(next);
    values.push(next);
  }
  return output;
}

function autoSeasonalLag(values, cadence, configuredLag = 0) {
  let lag = Math.max(0, Number(configuredLag) || 0);
  if (!lag) {
    lag = 1;
    if (cadence.kind === "month" && values.length >= 12) lag = 12;
    else if (cadence.kind === "day" && cadence.stepDays <= 1 && values.length >= 7) lag = 7;
    else if (cadence.kind === "day" && cadence.stepDays % 7 === 0 && values.length >= 4) lag = 4;
  }
  return Math.min(Math.max(1, lag), values.length);
}

function sarimaLikeForecast(records, horizon, cadence, params = {}) {
  const values = records.map((row) => row.y);
  if (values.length < 4) return movingAverageForecast(records, horizon, cadence);
  const lag = autoSeasonalLag(values, cadence, params.sarimaLag);
  const residuals = [];
  for (let i = lag; i < values.length; i += 1) residuals.push(values[i] - values[i - lag]);
  let phi = clamp(Number(params.sarimaAr) || 0.45, 0, 0.95);
  if (residuals.length >= 3) {
    let numerator = 0;
    let denominator = 0;
    for (let i = 1; i < residuals.length; i += 1) {
      numerator += residuals[i - 1] * residuals[i];
      denominator += residuals[i - 1] ** 2;
    }
    if (denominator > 0) phi = clamp(numerator / denominator, -0.95, 0.95) * phi;
  }
  let lastResidual = residuals.length ? residuals[residuals.length - 1] : 0;
  const output = [];
  for (let i = 0; i < horizon; i += 1) {
    const baseIndex = values.length - lag;
    const base = values[Math.max(0, baseIndex)];
    lastResidual *= phi;
    const next = base + lastResidual;
    output.push(next);
    values.push(next);
  }
  return output;
}

function featureMlForecast(records, horizon, cadence, params = {}) {
  const values = records.map((row) => row.y);
  if (values.length < 8) return etsForecast(records, horizon, params);
  const lag = autoSeasonalLag(values, cadence, params.featureLag);
  const rolling = Math.min(values.length, Math.max(2, Number(params.featureRolling) || 6));
  const start = Math.min(values.length - 2, Math.max(lag, rolling, 2));
  if (start < 2 || values.length - start < 4) return etsForecast(records, horizon, params);

  const localParams = {
    ...params,
    cadence,
    events: params.featureEvents === false ? [] : buildHolidayEvents(params.holidayCountry, records[0].ds, addPeriod(records[records.length - 1].ds, horizon, cadence)).concat(params.customEvents || []),
  };
  const xRows = [];
  const yRows = [];
  for (let i = start; i < values.length; i += 1) {
    xRows.push(featureMlRow(records[i].ds, values, i, lag, rolling, localParams));
    yRows.push(values[i]);
  }
  const standardized = standardizeMatrix(xRows);
  const penalties = xRows[0].map((_, index) => (index === 0 ? 0 : 0.35));
  const beta = ridgeRegression(standardized.matrix, yRows, penalties);
  const futureValues = values.slice();
  const output = [];
  for (let h = 1; h <= horizon; h += 1) {
    const ds = addPeriod(records[records.length - 1].ds, h, cadence);
    const row = featureMlRow(ds, futureValues, futureValues.length, lag, rolling, localParams);
    const predicted = dot(applyStandardization(row, standardized.means, standardized.stds), beta);
    const bounded = applyBusinessBounds(predicted, params);
    output.push(bounded);
    futureValues.push(bounded);
  }
  return output;
}

function featureMlRow(date, values, index, lag, rolling, params) {
  const last = values[Math.max(0, index - 1)] || 0;
  const lagValue = values[Math.max(0, index - lag)] || last;
  const recent = values.slice(Math.max(0, index - rolling), index);
  const rollingMean = recent.reduce((sum, value) => sum + value, 0) / Math.max(1, recent.length);
  const previous = values[Math.max(0, index - 2)] || last;
  const trend = last - previous;
  const monthAngle = (2 * Math.PI * date.getMonth()) / 12;
  const eventScore = (params.events || []).reduce((sum, event) => sum + holidayImpact(date, event, params), 0);
  return [
    1,
    index,
    last,
    lagValue,
    rollingMean,
    trend,
    Math.sin(monthAngle),
    Math.cos(monthAngle),
    eventScore,
  ];
}

function neuralProphetLikeForecast(records, horizon, cadence, params = {}) {
  const values = records.map((row) => row.y);
  if (values.length < 10) return featureMlForecast(records, horizon, cadence, params);
  const lag = Math.min(values.length - 2, Math.max(1, Number(params.neuralLag) || 6));
  const seasonWeight = clamp(Number(params.neuralSeasonWeight) || 1, 0, 2);
  const start = Math.min(values.length - 2, Math.max(lag, 4));
  const localParams = {
    ...params,
    cadence,
    events: params.neuralEvents === false ? [] : buildHolidayEvents(params.holidayCountry, records[0].ds, addPeriod(records[records.length - 1].ds, horizon, cadence)).concat(params.customEvents || []),
  };
  const xRows = [];
  const yRows = [];
  for (let i = start; i < values.length; i += 1) {
    xRows.push(neuralProphetRow(records[i].ds, values, i, lag, seasonWeight, localParams));
    yRows.push(values[i]);
  }
  const standardized = standardizeMatrix(xRows);
  const penalties = xRows[0].map((_, index) => (index === 0 ? 0 : 0.22));
  const beta = ridgeRegression(standardized.matrix, yRows, penalties);
  const futureValues = values.slice();
  const output = [];
  for (let h = 1; h <= horizon; h += 1) {
    const ds = addPeriod(records[records.length - 1].ds, h, cadence);
    const row = neuralProphetRow(ds, futureValues, futureValues.length, lag, seasonWeight, localParams);
    const predicted = dot(applyStandardization(row, standardized.means, standardized.stds), beta);
    const bounded = applyBusinessBounds(predicted, params);
    output.push(bounded);
    futureValues.push(bounded);
  }
  return output;
}

function neuralProphetRow(date, values, index, lag, seasonWeight, params) {
  const recent = [];
  for (let i = 1; i <= lag; i += 1) recent.push(values[Math.max(0, index - i)] || 0);
  const recentMean = recent.reduce((sum, value) => sum + value, 0) / Math.max(1, recent.length);
  const recentSlope = (recent[0] || 0) - (recent[Math.min(recent.length - 1, 2)] || recent[0] || 0);
  const monthAngle = (2 * Math.PI * date.getMonth()) / 12;
  const dayAngle = (2 * Math.PI * dayOfYear(date)) / 365.25;
  const eventScore = (params.events || []).reduce((sum, event) => sum + holidayImpact(date, event, params), 0);
  return [
    1,
    index,
    recent[0] || 0,
    recentMean,
    recentSlope,
    Math.sin(monthAngle) * seasonWeight,
    Math.cos(monthAngle) * seasonWeight,
    Math.sin(dayAngle) * seasonWeight,
    Math.cos(dayAngle) * seasonWeight,
    eventScore,
  ];
}

function nbeatsLikeForecast(records, horizon, cadence, params = {}) {
  const values = records.map((row) => row.y);
  if (values.length < 8) return seasonalNaiveForecast(records, horizon, cadence, params.nbeatsSeasonLag);
  const degree = Math.min(3, Math.max(1, Number(params.nbeatsTrendDegree) || 2));
  const lag = autoSeasonalLag(values, cadence, params.nbeatsSeasonLag);
  const xRows = values.map((_, index) => polynomialRow(index, degree));
  const standardized = standardizeMatrix(xRows);
  const beta = ridgeRegression(standardized.matrix, values, xRows[0].map((_, index) => (index === 0 ? 0 : 0.18)));
  const trend = values.map((_, index) => dot(applyStandardization(polynomialRow(index, degree), standardized.means, standardized.stds), beta));
  const residuals = values.map((value, index) => value - trend[index]);
  const futureValues = values.slice();
  const futureResiduals = residuals.slice();
  const output = [];
  for (let h = 1; h <= horizon; h += 1) {
    const index = values.length + h - 1;
    const trendValue = dot(applyStandardization(polynomialRow(index, degree), standardized.means, standardized.stds), beta);
    const seasonalResidual = futureResiduals[Math.max(0, futureResiduals.length - lag)] || 0;
    const next = applyBusinessBounds(trendValue + seasonalResidual, params);
    output.push(next);
    futureValues.push(next);
    futureResiduals.push(next - trendValue);
  }
  return output;
}

function polynomialRow(index, degree) {
  const t = index + 1;
  const row = [1];
  for (let d = 1; d <= degree; d += 1) row.push(t ** d);
  return row;
}

function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date - start) / 86400000);
}

function etsForecast(records, horizon, params = {}) {
  const values = records.map((row) => row.y);
  if (values.length < 3) return movingAverageForecast(records, horizon, { kind: "day" });
  if (params.etsAuto === false) return etsForecastWithSettings(values, horizon, params.etsAlpha, params.etsBeta, params.etsPhi);
  const alphas = [0.2, 0.4, 0.6, 0.8];
  const betas = [0.05, 0.1, 0.2, 0.35];
  const phis = [0.85, 0.95, 1];
  let best = null;

  alphas.forEach((alpha) => {
    betas.forEach((beta) => {
      phis.forEach((phi) => {
        let level = values[0];
        let trend = values[1] - values[0];
        let error = 0;
        for (let i = 1; i < values.length; i += 1) {
          const predicted = level + phi * trend;
          error += Math.abs(values[i] - predicted);
          const previousLevel = level;
          level = alpha * values[i] + (1 - alpha) * (level + phi * trend);
          trend = beta * (level - previousLevel) + (1 - beta) * phi * trend;
        }
        if (!best || error < best.error) best = { alpha, beta, phi, level, trend, error };
      });
    });
  });

  const output = [];
  for (let h = 1; h <= horizon; h += 1) {
    const trendFactor = best.phi === 1 ? h : (best.phi * (1 - best.phi ** h)) / (1 - best.phi);
    output.push(best.level + trendFactor * best.trend);
  }
  return output;
}

function etsForecastWithSettings(values, horizon, alpha = 0.4, beta = 0.1, phi = 0.95) {
  let level = values[0];
  let trend = values[1] - values[0];
  for (let i = 1; i < values.length; i += 1) {
    const previousLevel = level;
    level = alpha * values[i] + (1 - alpha) * (level + phi * trend);
    trend = beta * (level - previousLevel) + (1 - beta) * phi * trend;
  }
  return Array.from({ length: horizon }, (_, index) => {
    const h = index + 1;
    const trendFactor = phi === 1 ? h : (phi * (1 - phi ** h)) / (1 - phi);
    return level + trendFactor * trend;
  });
}

function getParams() {
  return {
    forecastModel: els.forecastModel.value,
    growth: els.growth.value,
    horizon: Math.max(1, Number(els.horizon.value) || 30),
    forecastCadenceUnit: els.forecastCadenceUnit.value,
    forecastStep: Math.max(1, Number(els.forecastStep.value) || 1),
    changepoints: Number(els.changepoints.value),
    changepointRange: clamp(Number(els.changepointRange.value) || 0.8, 0.1, 1),
    changepointPriorScale: rangeScale(els.changepointPriorScale.value),
    cap: optionalNumber(els.cap.value),
    floor: optionalNumber(els.floor.value) ?? 0,
    seasonalityMode: els.seasonalityMode.value,
    seasonalityPriorScale: Math.max(0.01, Number(els.seasonalityPriorScale.value) || 10),
    intervalWidth: Number(els.intervalWidth.value),
    uncertaintySamples: Number(els.uncertaintySamples.value) || 1000,
    weekly: els.weekly.checked,
    weeklyOrder: Math.max(1, Number(els.weeklyOrder.value) || 3),
    monthly: els.monthly.checked,
    monthlyOrder: Math.max(1, Number(els.monthlyOrder.value) || 3),
    quarterly: els.quarterly.checked,
    quarterlyOrder: Math.max(1, Number(els.quarterlyOrder.value) || 4),
    yearly: els.yearly.checked,
    yearlyOrder: Math.max(1, Number(els.yearlyOrder.value) || 5),
    clipZero: els.clipZero.checked,
    holidayCountry: els.holidayCountry.value,
    holidayPriorScale: Math.max(0.01, Number(els.holidayPriorScale.value) || 10),
    holidayLowerWindow: Math.min(0, Number(els.holidayLowerWindow.value) || 0),
    holidayUpperWindow: Math.max(0, Number(els.holidayUpperWindow.value) || 0),
    etsAuto: els.etsAuto.checked,
    etsAlpha: clamp(Number(els.etsAlpha.value) || 0.4, 0.01, 0.99),
    etsBeta: clamp(Number(els.etsBeta.value) || 0.1, 0, 0.99),
    etsPhi: clamp(Number(els.etsPhi.value) || 0.95, 0.5, 1),
    sarimaLag: Math.max(0, Number(els.sarimaLag.value) || 0),
    sarimaAr: clamp(Number(els.sarimaAr.value) || 0.45, 0, 0.95),
    featureLag: Math.max(0, Number(els.featureLag.value) || 0),
    featureRolling: Math.max(2, Number(els.featureRolling.value) || 6),
    featureEvents: els.featureEvents.checked,
    neuralLag: Math.max(1, Number(els.neuralLag.value) || 6),
    neuralSeasonWeight: clamp(Number(els.neuralSeasonWeight.value) || 1, 0, 2),
    neuralEvents: els.neuralEvents.checked,
    nbeatsTrendDegree: Math.min(3, Math.max(1, Number(els.nbeatsTrendDegree.value) || 2)),
    nbeatsSeasonLag: Math.max(0, Number(els.nbeatsSeasonLag.value) || 0),
    movingAverageWindow: Math.max(0, Number(els.movingAverageWindow.value) || 0),
    seasonalNaiveLag: Math.max(0, Number(els.seasonalNaiveLag.value) || 0),
    customEvents: parseEvents(),
    events: [],
  };
}

async function runForecast() {
  if (!state.rawRows.length) {
    setStatus("status.noData", "idle");
    drawEmpty();
    return;
  }

  try {
    const records = prepareSeries();
    const params = getParams();
    const result = trainSelectedModel(records, params);
    result.modelComparison = compareModels(records, getParams());
    result.historicalModelFits = compareHistoricalFits(records, getParams());
    result.futureModelForecasts = compareFutureModels(records, getParams());
    result.backendRecommendation = null;
    state.modelResult = result;
    state.experiments.unshift({
      model: result.modelName || modelLabel(params.forecastModel),
      horizon: params.horizon,
      setting: experimentSettingLabel(params, result),
      mape: result.mape,
      createdAt: new Date(),
    });
    state.experiments = state.experiments.slice(0, 12);
    renderResult(result);
    renderExperiments();
    setStatus("status.localDoneSyncing", "idle", { periods: result.future.length });
    try {
      const syncResult = await syncBackendExperiment(params);
      state.backendExperiment = syncResult?.experiment || null;
      if (syncResult?.experiment) {
        const recommended = syncResult.experiment.recommended_model || "-";
        const recommendedName = modelName(recommended);
        result.backendRecommendation = {
          id: recommended,
          name: recommendedName,
          experimentId: syncResult.experiment.id,
        };
        state.experiments[0].setting = `${state.experiments[0].setting} / API ${t("chart.recommended")} ${recommendedName}`;
        renderResult(result);
        renderExperiments();
        renderBackendExperiment(syncResult);
        setStatus("status.doneWithBackend", "ok", {
          periods: result.future.length,
          experimentId: syncResult.experiment.id,
          modelName: recommendedName,
        });
      } else {
        setStatus("status.doneNoBackend", "ok", { periods: result.future.length });
      }
    } catch (syncError) {
      setStatus("status.backendFailed", "bad", { message: syncError.message });
    }
  } catch (error) {
    setStatus(null, "bad", {}, error.message);
  }
}

function renderResult(result) {
  const avg = result.records.reduce((sum, row) => sum + row.y, 0) / result.records.length;
  const forecastTotal = result.future.reduce((sum, row) => sum + row.yhat, 0);
  const lowTotal = result.future.reduce((sum, row) => sum + row.yhatLower, 0);
  const highTotal = result.future.reduce((sum, row) => sum + row.yhatUpper, 0);
  const forecastAvg = forecastTotal / result.future.length;
  const peak = result.future.reduce((best, row) => (row.yhat > best.yhat ? row : best), result.future[0]);
  const low = result.future.reduce((best, row) => (row.yhat < best.yhat ? row : best), result.future[0]);
  const currentModelName = result.modelName || modelLabel(result.params.forecastModel);

  els.metricRows.textContent = formatNumber(result.records.length, 0);
  els.metricAvg.textContent = formatNumber(avg, 0);
  els.metricForecast.textContent = formatNumber(forecastTotal, 0);
  els.metricMape.textContent = `${formatNumber(result.mape * 100, 1)}%`;
  els.chartSubtitle.textContent = lt(
    `${formatDate(result.records[0].ds)} 至 ${formatDate(result.future[result.future.length - 1].ds)}`,
    `${formatDate(result.records[0].ds)} to ${formatDate(result.future[result.future.length - 1].ds)}`,
  );
  els.forecastSummaryCaption.textContent = lt(
    `当前主模型：${currentModelName}；完整显示 ${result.future.length} 期预测，输出步长：${cadenceLabel(result.cadence)}`,
    `Current primary model: ${currentModelName}. Showing all ${result.future.length} forecast periods. Output cadence: ${cadenceLabel(result.cadence)}`,
  );
  els.forecastTableCaption.textContent = lt(
    `主模型完整 ${result.future.length} 期；红色高位、金色推荐位、绿色低位均可导出`,
    `Full ${result.future.length} primary-model periods. Red high, gold recommended, and green low values are exportable.`,
  );
  els.downloadBtn.disabled = false;
  els.modelNotes.innerHTML = modelNoteItems(result).join("");
  els.forecastSummary.innerHTML = [
    [lt("当前主模型", "Current primary model"), currentModelName],
    [lt("预测期数", "Forecast periods"), t("common.periods", { count: result.future.length })],
    [lt("推荐均值", "Recommended average"), formatNumber(forecastAvg, 0)],
    [lt("低-推荐-高合计", "Low / recommended / high total"), `${formatNumber(lowTotal, 0)} / ${formatNumber(forecastTotal, 0)} / ${formatNumber(highTotal, 0)}`],
    [lt("推荐峰值", "Recommended peak"), `${formatDate(peak.ds)} / ${formatNumber(peak.yhat, 0)}`],
    [lt("推荐低点", "Recommended low point"), `${formatDate(low.ds)} / ${formatNumber(low.yhat, 0)}`],
  ]
    .map(([label, value]) => `<span>${label}<strong>${value}</strong></span>`)
    .join("");
  els.marketGuide.innerHTML = marketAdvice(result.params, result.cadence).map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  renderHolidayDatePreview(result);
  renderProcessingAudit(result);
  renderModelComparison(result);

  els.forecastRows.innerHTML = result.future
    .map(
      (row) => `<tr data-forecast-index="${row.period - 1}">
        <td>${row.period}</td>
        <td>${formatDate(row.ds)}</td>
        <td>${escapeHtml(t("common.days", { count: row.daysAhead }))}</td>
        <td>${formatNumber(row.yhatLower, 0)}</td>
        <td>${formatNumber(row.yhat, 0)}</td>
        <td>${formatNumber(row.yhatUpper, 0)}</td>
        <td>${row.events.length ? escapeHtml(localizedEventList(row.events).slice(0, 3).join(" / ")) : "-"}</td>
      </tr>`,
    )
    .join("");

  drawChart(result);
}

function noteChip(label, value, tip = "") {
  const help = tip ? ` <span class="help-icon" data-tip="${escapeHtml(tip)}">?</span>` : "";
  return `<span>${escapeHtml(label)}${fieldSeparator()}${escapeHtml(value)}${help}</span>`;
}

function modelNoteItems(result) {
  const params = result.params;
  const items = [noteChip(lt("主模型", "Primary model"), result.modelName || modelLabel(params.forecastModel))];
  if (params.forecastModel === "ets") {
    items.push(noteChip(lt("ETS 自动优化", "ETS auto tuning"), params.etsAuto ? t("common.enabled") : t("common.disabled"), lt("开启时会在一组 alpha、beta、phi 候选值中选择历史误差较小的组合。", "When enabled, the model chooses lower-error alpha, beta, and phi values from a candidate grid.")));
    items.push(noteChip("alpha", formatNumber(params.etsAlpha, 2), lt("水平平滑系数。越大越重视最近一期，越小越平滑。", "Level smoothing coefficient. Larger values emphasize the latest period; smaller values smooth more.")));
    items.push(noteChip("beta", formatNumber(params.etsBeta, 2), lt("趋势平滑系数。越大趋势变化越灵敏，越小趋势更稳定。", "Trend smoothing coefficient. Larger values react faster to trend changes; smaller values are more stable.")));
    items.push(noteChip("phi", formatNumber(params.etsPhi, 2), lt("趋势阻尼系数。1 表示不阻尼；小于 1 表示长期趋势逐步收敛。", "Trend damping coefficient. 1 means no damping; below 1 makes long-term trend converge.")));
  } else if (params.forecastModel === "sarima") {
    items.push(noteChip(lt("季节回看", "Seasonal lookback"), params.sarimaLag ? `${params.sarimaLag}` : t("common.auto"), lt("SARIMA-like 会先复用上一季节周期，再用 AR 残差修正近期偏差。", "SARIMA-like reuses the last seasonal cycle first, then applies AR residual correction.")));
    items.push(noteChip(lt("AR 残差强度", "AR residual strength"), formatNumber(params.sarimaAr, 2), lt("控制近期误差惯性保留多久。越大越容易延续近期高估或低估。", "Controls how long recent error inertia persists. Higher values continue recent over/under-estimation longer.")));
  } else if (params.forecastModel === "featureMl") {
    items.push(noteChip(lt("滞后周期", "Lag periods"), params.featureLag ? `${params.featureLag}` : t("common.auto"), lt("把 N 期前的销量作为特征，适合捕捉周/月/年同期规律。", "Uses sales from N periods ago as a feature to capture weekly/monthly/yearly same-period patterns.")));
    items.push(noteChip(lt("滚动窗口", "Rolling window"), `${params.featureRolling}`, lt("使用最近 N 期均值作为特征，降低单点噪声影响。", "Uses the latest N-period average as a feature to reduce single-point noise.")));
    items.push(noteChip(lt("活动特征", "Event features"), params.featureEvents ? t("common.enabled") : t("common.disabled"), lt("启用后会把目标市场节假日和自定义活动作为特征。", "When enabled, target-market holidays and custom events are used as features.")));
  } else if (params.forecastModel === "neuralProphet") {
    items.push(noteChip(lt("AR 回看", "AR lookback"), `${params.neuralLag}`, lt("模拟 NeuralProphet 的自回归记忆，使用最近 N 期历史参与预测。", "Simulates NeuralProphet autoregressive memory using the latest N historical periods.")));
    items.push(noteChip(lt("季节权重", "Season weight"), formatNumber(params.neuralSeasonWeight, 1), lt("控制季节特征在高级模型中的影响强度。", "Controls the influence of seasonal features in the advanced model.")));
    items.push(noteChip(lt("活动特征", "Event features"), params.neuralEvents ? t("common.enabled") : t("common.disabled"), lt("启用后将目标市场节假日和自定义活动作为外部特征。", "When enabled, target-market holidays and custom events are used as external features.")));
  } else if (params.forecastModel === "nbeats") {
    items.push(noteChip(lt("趋势阶数", "Trend degree"), `${params.nbeatsTrendDegree}`, lt("模拟 N-BEATS 趋势块。阶数越高越能表达弯曲趋势，但更容易过拟合。", "Simulates the N-BEATS trend block. Higher degrees model curved trends but can overfit.")));
    items.push(noteChip(lt("季节回看", "Seasonal lookback"), params.nbeatsSeasonLag ? `${params.nbeatsSeasonLag}` : t("common.auto"), lt("模拟 N-BEATS 季节块，复用上一周期残差。", "Simulates the N-BEATS seasonal block by reusing residuals from the previous cycle.")));
  } else if (params.forecastModel === "movingAverage") {
    items.push(noteChip(lt("窗口期数", "Window periods"), params.movingAverageWindow ? `${params.movingAverageWindow}` : t("common.auto"), lt("移动平均使用最近 N 期的平均值。窗口越小越灵敏，窗口越大越平滑。", "Moving average uses the latest N-period average. Smaller windows react faster; larger windows smooth more.")));
  } else if (params.forecastModel === "seasonalNaive") {
    items.push(noteChip(lt("回看周期", "Lookback periods"), params.seasonalNaiveLag ? `${params.seasonalNaiveLag}` : t("common.auto"), lt("Seasonal Naive 会复制 N 期之前的值。自动模式会按月/日/周频率选择常见周期。", "Seasonal Naive copies values from N periods ago. Auto mode chooses common cycles by monthly/daily/weekly frequency.")));
  } else {
    items.push(noteChip(lt("增长", "Growth"), params.growth));
    items.push(noteChip(lt("季节模式", "Seasonality mode"), params.seasonalityMode, lt("additive 表示季节波动用加法叠加；multiplicative 表示按趋势规模成比例放大。", "additive adds seasonal variation; multiplicative scales it with trend size.")));
    items.push(noteChip(lt("有效季节", "Active seasonality"), localizedSeasonalityActive(params.effectiveSeasonality) || t("common.none")));
    items.push(noteChip(lt("变化点", "Changepoints"), `${result.changepoints.length}`));
    items.push(noteChip(lt("趋势灵活度 cp_prior", "Trend flexibility cp_prior"), formatNumber(params.changepointPriorScale, 2), lt("控制趋势变化点的自由度。越大，趋势越容易转折并贴合突变；越小，趋势越平滑。", "Controls changepoint flexibility. Larger values allow more turning and shock fitting; smaller values smooth the trend.")));
    items.push(noteChip(lt("季节强度 season_prior", "Seasonality strength season_prior"), formatNumber(params.seasonalityPriorScale, 1), lt("控制周/月/季度/年季节项的强度。越大越贴合周期波动；越小周期越平滑。", "Controls weekly/monthly/quarterly/yearly seasonality strength. Larger values follow cycles more closely; smaller values smooth them.")));
    items.push(noteChip(lt("活动强度 holiday_prior", "Event strength holiday_prior"), formatNumber(params.holidayPriorScale, 1), lt("控制节假日和大促活动特征的影响强度。越大，模型越愿意把峰谷解释为活动影响。", "Controls the impact of holidays and campaigns. Larger values make the model more willing to explain peaks/dips as event effects.")));
    items.push(noteChip(lt("市场", "Market"), params.holidayCountry));
    items.push(noteChip(lt("活动特征", "Event features"), `${params.events.length}`));
  }
  items.push(noteChip(lt("业务下限", "Business floor"), params.clipZero ? `>= ${formatNumber(businessFloor(params), 0)}` : t("common.disabled"), lt("启用后，历史拟合和未来预测会按业务下限裁剪，避免出现负销售。", "When enabled, historical fit and future forecast values are clipped by the business floor to avoid negative sales.")));
  return items;
}

function renderExperiments() {
  els.experimentRows.innerHTML = state.experiments
    .map(
      (item, index) => `<tr>
        <td>${state.experiments.length - index}</td>
        <td>${escapeHtml(item.model)}</td>
        <td>${item.horizon}</td>
        <td>${escapeHtml(item.setting)}</td>
        <td>${formatNumber(item.mape * 100, 1)}%</td>
      </tr>`,
    )
    .join("");
}

function experimentSettingLabel(params, result) {
  const cadence = lt(`步长 ${cadenceLabel(result.cadence)}`, `cadence ${cadenceLabel(result.cadence)}`);
  const autoText = t("common.auto");
  if (params.forecastModel === "ets") {
    return params.etsAuto ? `auto alpha/beta/phi / ${cadence}` : `alpha ${formatNumber(params.etsAlpha, 2)} / beta ${formatNumber(params.etsBeta, 2)} / phi ${formatNumber(params.etsPhi, 2)} / ${cadence}`;
  }
  if (params.forecastModel === "sarima") return `${lt("季节", "season lag")} ${params.sarimaLag || autoText} / AR ${formatNumber(params.sarimaAr, 2)} / ${cadence}`;
  if (params.forecastModel === "featureMl") return `lag ${params.featureLag || autoText} / rolling ${params.featureRolling} / events ${params.featureEvents ? "on" : "off"} / ${cadence}`;
  if (params.forecastModel === "neuralProphet") return `AR ${params.neuralLag} / season ${formatNumber(params.neuralSeasonWeight, 1)} / events ${params.neuralEvents ? "on" : "off"} / ${cadence}`;
  if (params.forecastModel === "nbeats") return `degree ${params.nbeatsTrendDegree} / season ${params.nbeatsSeasonLag || autoText} / ${cadence}`;
  if (params.forecastModel === "movingAverage") return `${lt("窗口", "window")} ${params.movingAverageWindow || autoText} / ${cadence}`;
  if (params.forecastModel === "seasonalNaive") return `${lt("回看", "lookback")} ${params.seasonalNaiveLag || autoText} / ${cadence}`;
  return `${lt("变化点", "changepoints")} ${result.changepoints.length} / cp ${formatNumber(params.changepointPriorScale, 2)} / season ${formatNumber(params.seasonalityPriorScale, 1)} / holiday ${formatNumber(params.holidayPriorScale, 1)} / ${cadence}`;
}

function drawEmpty() {
  els.chart.innerHTML = `<div class="empty-state">${escapeHtml(t("chart.empty"))}</div>`;
  els.modelNotes.innerHTML = "";
  els.processingAudit.innerHTML = "";
  els.modelComparisonCaption.textContent = t("static.modelComparisonWaiting");
  els.modelComparison.innerHTML = "";
  els.forecastSummaryCaption.textContent = t("static.forecastSummaryWaiting");
  els.forecastSummary.innerHTML = "";
  els.marketGuide.innerHTML = "";
  els.holidayDatePreview.innerHTML = "";
  els.forecastTableCaption.textContent = t("static.primaryForecastTableCaption");
}

function refreshForLocaleChange() {
  applyStaticI18n();
  if (state.rawRows.length) {
    const groupValue = els.groupFilter.value;
    updateGroupFilter();
    if (Array.from(els.groupFilter.options).some((option) => option.value === groupValue)) {
      els.groupFilter.value = groupValue;
    }
  }
  renderHolidayTemplatePreview(els.holidayCountry.value);
  if (state.modelResult) {
    renderResult(state.modelResult);
    renderExperiments();
  } else {
    drawEmpty();
  }
}

function drawChart(result) {
  const width = Math.max(760, els.chart.clientWidth || 900);
  const height = 430;
  const margin = { top: 24, right: 34, bottom: 44, left: 70 };
  const modelForecasts = (result.futureModelForecasts || []).filter((model) => model.values?.length);
  const comparisonLines = modelForecasts.filter((model) => model.id !== selectedModelId(result.params.forecastModel));
  const modelFits = (result.historicalModelFits || []).filter((model) => model.values?.length);
  const fitComparisonLines = modelFits.filter((model) => model.id !== selectedModelId(result.params.forecastModel));
  const history = result.records.map((row) => ({ ds: row.ds, value: row.y }));
  const fitted = result.fitted.map((row) => ({ ds: row.ds, value: row.yhat }));
  const futureRecommended = result.future.map((row) => ({ ds: row.ds, value: row.yhat }));
  const futureLow = result.future.map((row) => ({ ds: row.ds, value: row.yhatLower }));
  const futureHigh = result.future.map((row) => ({ ds: row.ds, value: row.yhatUpper }));
  const bandTop = result.future.map((row) => ({ ds: row.ds, value: row.yhatUpper }));
  const bandBottom = result.future.slice().reverse().map((row) => ({ ds: row.ds, value: row.yhatLower }));
  const all = history.concat(
    fitted,
    futureRecommended,
    futureLow,
    futureHigh,
    bandTop,
    bandBottom,
    modelFits.flatMap((model) => model.values.map((row) => ({ ds: row.ds, value: row.value }))),
    modelForecasts.flatMap((model) => model.values.map((row) => ({ ds: row.ds, value: row.value }))),
  );
  const hoverPoints = result.records
    .map((row, index) => ({
      kind: "history",
      ds: row.ds,
      period: index + 1,
      actual: row.y,
      fitted: result.fitted[index].yhat,
      fitValues: modelFits
        .map((model) => {
          const item = model.values[index];
          return item ? { name: model.name, color: model.color, value: item.value, errorPct: item.errorPct } : null;
        })
        .filter(Boolean),
    }))
    .concat(
      result.future.map((row) => ({
        kind: "forecast",
        ds: row.ds,
        period: row.period,
        daysAhead: row.daysAhead,
        yhat: row.yhat,
        yhatLower: row.yhatLower,
        yhatUpper: row.yhatUpper,
        events: row.events,
        modelValues: modelForecasts
          .map((model) => {
            const item = model.values[row.period - 1];
            return item ? { name: model.name, color: model.color, value: item.value } : null;
          })
          .filter(Boolean),
      })),
    );
  const xMin = Math.min(...all.map((d) => d.ds.getTime()));
  const xMax = Math.max(...all.map((d) => d.ds.getTime()));
  const yMin = Math.min(0, ...all.map((d) => d.value)) * 0.98;
  const yMax = Math.max(...all.map((d) => d.value)) * 1.06;

  const x = (date) => margin.left + ((date.getTime() - xMin) / (xMax - xMin || 1)) * (width - margin.left - margin.right);
  const y = (value) => height - margin.bottom - ((value - yMin) / (yMax - yMin || 1)) * (height - margin.top - margin.bottom);

  const line = (points) => points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.ds).toFixed(2)} ${y(p.value).toFixed(2)}`).join(" ");
  const area = line(bandTop) + " " + bandBottom.map((p) => `L ${x(p.ds).toFixed(2)} ${y(p.value).toFixed(2)}`).join(" ") + " Z";
  const ticks = makeTicks(xMin, xMax, 5);
  const yTicks = makeNumberTicks(yMin, yMax, 5);
  const chartBg = getCss("--panel") || "#fff";
  const gridColor = getCss("--line") || "#edf1f3";
  const axisText = getCss("--muted") || "#66737f";
  const actualColor = getCss("--ink") || "#33424e";
  const fittedColor = getCss("--muted") || "#7a8791";
  const pointStroke = getCss("--panel") || "#fff";
  const splitLineColor = getCss("--accent-line") || "#9aa5ad";

  els.chart.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(t("chart.aria"))}">
      <rect x="0" y="0" width="${width}" height="${height}" fill="${chartBg}"></rect>
      ${yTicks
        .map(
          (tick) => `<g>
            <line x1="${margin.left}" y1="${y(tick)}" x2="${width - margin.right}" y2="${y(tick)}" stroke="${gridColor}"></line>
            <text x="${margin.left - 12}" y="${y(tick) + 4}" text-anchor="end" fill="${axisText}" font-size="12">${compactNumber(tick)}</text>
          </g>`,
        )
        .join("")}
      ${ticks
        .map(
          (tick) => `<text x="${x(tick)}" y="${height - 16}" text-anchor="middle" fill="${axisText}" font-size="12">${formatShortDate(tick)}</text>`,
        )
        .join("")}
      <path d="${area}" fill="rgba(217, 154, 34, 0.10)"></path>
      ${fitComparisonLines
        .map((model) => `<path data-layer="historical-fit" d="${line(model.values)}" fill="none" stroke="${model.color}" stroke-width="1.8" opacity="0.46"></path>`)
        .join("")}
      <path data-layer="main-fit" d="${line(fitted)}" fill="none" stroke="${fittedColor}" stroke-width="2" stroke-dasharray="5 5"></path>
      <path d="${line(history)}" fill="none" stroke="${actualColor}" stroke-width="3"></path>
      ${comparisonLines
        .map((model) => `<path data-layer="future-model" d="${line(model.values)}" fill="none" stroke="${model.color}" stroke-width="2" stroke-dasharray="7 5" opacity="0.82"></path>`)
        .join("")}
      <path d="${line(futureHigh)}" fill="none" stroke="${getCss("--high")}" stroke-width="3"></path>
      <path d="${line(futureRecommended)}" fill="none" stroke="${getCss("--gold")}" stroke-width="3"></path>
      <path d="${line(futureLow)}" fill="none" stroke="${getCss("--low")}" stroke-width="3"></path>
      ${history.map((p) => `<circle cx="${x(p.ds)}" cy="${y(p.value)}" r="3" fill="${actualColor}"></circle>`).join("")}
      <line x1="${x(result.records[result.records.length - 1].ds)}" y1="${margin.top}" x2="${x(result.records[result.records.length - 1].ds)}" y2="${height - margin.bottom}" stroke="${splitLineColor}" stroke-dasharray="4 6"></line>
      <g id="chartHover" style="display: none;">
        <line id="hoverLine" x1="0" y1="${margin.top}" x2="0" y2="${height - margin.bottom}" stroke="${actualColor}" stroke-dasharray="3 5"></line>
        <circle id="hoverActual" r="5" fill="${actualColor}" stroke="${pointStroke}" stroke-width="2"></circle>
        <circle id="hoverFitted" r="5" fill="${fittedColor}" stroke="${pointStroke}" stroke-width="2"></circle>
        <circle id="hoverForecastHigh" r="5" fill="${getCss("--high")}" stroke="${pointStroke}" stroke-width="2"></circle>
        <circle id="hoverForecast" r="5" fill="${getCss("--gold")}" stroke="${pointStroke}" stroke-width="2"></circle>
        <circle id="hoverForecastLow" r="5" fill="${getCss("--low")}" stroke="${pointStroke}" stroke-width="2"></circle>
      </g>
      <rect id="chartHitArea" x="${margin.left}" y="${margin.top}" width="${width - margin.left - margin.right}" height="${height - margin.top - margin.bottom}" fill="transparent" style="pointer-events: all;"></rect>
    </svg>
    <div class="chart-model-legend">
      <span><i style="background:${actualColor}"></i>${escapeHtml(t("chart.actual"))}</span>
      <span><i class="legend-fit" style="background:${fittedColor}"></i>${escapeHtml(t("chart.historyFit"))}</span>
      <span><i style="background:${getCss("--gold")}"></i>${escapeHtml(t("chart.primaryRecommended"))}</span>
      ${comparisonLines.map((model) => `<span><i style="background:${model.color}"></i>${escapeHtml(model.name)}</span>`).join("")}
      ${fitComparisonLines.length ? `<span class="legend-note">${escapeHtml(t("chart.legendNote"))}</span>` : ""}
    </div>
    <div id="chartTooltip" class="tooltip is-hidden"></div>
  `;
  attachChartHover(result, hoverPoints, { width, height, margin, x, y });
}

function selectedModelId(model) {
  if (model === "featureMl") return "featureMl";
  if (model === "neuralProphet") return "neuralProphet";
  if (model === "nbeats") return "nbeats";
  if (model === "sarima") return "sarima";
  if (model === "ets") return "ets";
  if (model === "movingAverage") return "movingAverage";
  if (model === "seasonalNaive") return "seasonalNaive";
  return "prophet";
}

function attachChartHover(result, points, scale) {
  const svg = els.chart.querySelector("svg");
  const hitArea = els.chart.querySelector("#chartHitArea");
  const hover = els.chart.querySelector("#chartHover");
  const hoverLine = els.chart.querySelector("#hoverLine");
  const hoverActual = els.chart.querySelector("#hoverActual");
  const hoverFitted = els.chart.querySelector("#hoverFitted");
  const hoverForecast = els.chart.querySelector("#hoverForecast");
  const hoverForecastHigh = els.chart.querySelector("#hoverForecastHigh");
  const hoverForecastLow = els.chart.querySelector("#hoverForecastLow");
  const tooltip = els.chart.querySelector("#chartTooltip");
  if (!svg || !hitArea || !hover || !tooltip) return;

  const hide = () => {
    hover.style.display = "none";
    tooltip.classList.add("is-hidden");
    clearForecastHighlight();
  };

  const showCircle = (circle, cx, cy) => {
    circle.style.display = "";
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
  };

  const hideCircle = (circle) => {
    circle.style.display = "none";
  };

  const move = (event) => {
    const svgRect = svg.getBoundingClientRect();
    const chartRect = els.chart.getBoundingClientRect();
    const mouseX = (event.clientX - svgRect.left) * (scale.width / svgRect.width);
    const nearest = points.reduce((best, point) => {
      const distance = Math.abs(scale.x(point.ds) - mouseX);
      return distance < best.distance ? { point, distance } : best;
    }, { point: points[0], distance: Number.POSITIVE_INFINITY }).point;
    const cx = scale.x(nearest.ds);

    hover.style.display = "";
    hoverLine.setAttribute("x1", cx);
    hoverLine.setAttribute("x2", cx);

    if (nearest.kind === "history") {
      showCircle(hoverActual, cx, scale.y(nearest.actual));
      showCircle(hoverFitted, cx, scale.y(nearest.fitted));
      hideCircle(hoverForecast);
      hideCircle(hoverForecastHigh);
      hideCircle(hoverForecastLow);
      tooltip.innerHTML = historyTooltip(nearest);
      clearForecastHighlight();
    } else {
      hideCircle(hoverActual);
      hideCircle(hoverFitted);
      showCircle(hoverForecastHigh, cx, scale.y(nearest.yhatUpper));
      showCircle(hoverForecast, cx, scale.y(nearest.yhat));
      showCircle(hoverForecastLow, cx, scale.y(nearest.yhatLower));
      tooltip.innerHTML = forecastTooltip(nearest, result.params.intervalWidth);
      highlightForecastRow(nearest.period - 1);
    }

    tooltip.classList.remove("is-hidden");
    const left = Math.min(Math.max(event.clientX - chartRect.left, 150), chartRect.width - 150);
    const top = Math.max(event.clientY - chartRect.top, 95);
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  };

  hitArea.addEventListener("mousemove", move);
  hitArea.addEventListener("mouseleave", hide);
}

function historyTooltip(point) {
  const error = point.actual === 0 ? null : Math.abs((point.actual - point.fitted) / point.actual) * 100;
  const modelRows = (point.fitValues || [])
    .map((item) => {
      const errorText = item.errorPct === null ? "-" : `${formatNumber(item.errorPct, 1)}%`;
      return `<span><i style="background:${item.color}"></i>${escapeHtml(item.name)}</span><span>${formatNumber(item.value, 0)} / ${errorText}</span>`;
    })
    .join("");
  return `<strong>${escapeHtml(t("chart.historyTitle", { period: point.period, date: formatDate(point.ds) }))}</strong>
    <div class="tip-grid">
      <span>${escapeHtml(t("chart.actualSales"))}</span><span>${formatNumber(point.actual, 0)}</span>
      <span>${escapeHtml(t("chart.modelFit"))}</span><span>${formatNumber(point.fitted, 0)}</span>
      <span>${escapeHtml(t("chart.pointError"))}</span><span>${error === null ? "-" : `${formatNumber(error, 1)}%`}</span>
      ${modelRows ? `<span class="tip-section">${escapeHtml(t("chart.modelFitValues"))}</span><span></span>${modelRows}` : ""}
    </div>`;
}

function forecastTooltip(point, intervalWidth) {
  const events = point.events.length ? escapeHtml(localizedEventList(point.events).slice(0, 5).join(" / ")) : t("common.none");
  const modelRows = (point.modelValues || [])
    .map((item) => `<span><i style="background:${item.color}"></i>${escapeHtml(item.name)}</span><span>${formatNumber(item.value, 0)}</span>`)
    .join("");
  return `<strong>${escapeHtml(t("chart.forecastTitle", { period: point.period, date: formatDate(point.ds) }))}</strong>
    <div class="tip-grid">
      <span>${escapeHtml(t("chart.daysAhead"))}</span><span>${escapeHtml(t("common.days", { count: point.daysAhead }))}</span>
      <span>${escapeHtml(t("chart.low"))}</span><span>${formatNumber(point.yhatLower, 0)}</span>
      <span>${escapeHtml(t("chart.recommended"))}</span><span>${formatNumber(point.yhat, 0)}</span>
      <span>${escapeHtml(t("chart.high"))}</span><span>${formatNumber(point.yhatUpper, 0)}</span>
      <span>${escapeHtml(t("chart.interval"))}</span><span>${formatNumber(intervalWidth * 100, 0)}%</span>
      <span>${escapeHtml(t("chart.events"))}</span><span>${events}</span>
      ${modelRows ? `<span class="tip-section">${escapeHtml(t("chart.modelCompare"))}</span><span></span>${modelRows}` : ""}
    </div>`;
}

function highlightForecastRow(index) {
  clearForecastHighlight();
  const row = els.forecastRows.querySelector(`[data-forecast-index="${index}"]`);
  if (row) row.classList.add("active-row");
}

function clearForecastHighlight() {
  els.forecastRows.querySelectorAll(".active-row").forEach((row) => row.classList.remove("active-row"));
}

function setupHelpTooltips() {
  const tooltip = document.createElement("div");
  tooltip.className = "help-tooltip is-hidden";
  document.body.appendChild(tooltip);

  const place = (target) => {
    const text = localizedHelpTip(target.dataset.tip);
    if (!text) return;
    tooltip.textContent = text;
    tooltip.classList.remove("is-hidden");
    const rect = target.getBoundingClientRect();
    const tipRect = tooltip.getBoundingClientRect();
    const gap = 10;
    let left = rect.left + rect.width / 2 - tipRect.width / 2;
    let top = rect.top - tipRect.height - gap;
    if (top < 8) top = rect.bottom + gap;
    left = Math.min(Math.max(8, left), window.innerWidth - tipRect.width - 8);
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  };

  const hide = () => tooltip.classList.add("is-hidden");

  const targetFromEvent = (event) => event.target.closest?.(".help-icon");
  document.addEventListener("mouseover", (event) => {
    const icon = targetFromEvent(event);
    if (icon) place(icon);
  });
  document.addEventListener("mousemove", (event) => {
    const icon = targetFromEvent(event);
    if (icon) place(icon);
  });
  document.addEventListener("mouseout", (event) => {
    if (targetFromEvent(event)) hide();
  });
  document.addEventListener("focusin", (event) => {
    const icon = targetFromEvent(event);
    if (icon) place(icon);
  });
  document.addEventListener("focusout", (event) => {
    if (targetFromEvent(event)) hide();
  });
  document.querySelectorAll(".help-icon").forEach((icon) => icon.setAttribute("tabindex", "0"));

  window.addEventListener("scroll", hide, true);
  window.addEventListener("resize", hide);
}

function makeTicks(minMs, maxMs, count) {
  const ticks = [];
  for (let i = 0; i < count; i += 1) {
    ticks.push(new Date(minMs + ((maxMs - minMs) * i) / (count - 1)));
  }
  return ticks;
}

function makeNumberTicks(min, max, count) {
  const ticks = [];
  for (let i = 0; i < count; i += 1) ticks.push(min + ((max - min) * i) / (count - 1));
  return ticks;
}

function csvValue(value) {
  if (value === null || value === undefined) return "";
  const text = value instanceof Date ? formatDate(value) : String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function downloadCsv(filename, rows) {
  const csv = rows.map((row) => row.map(csvValue).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadForecast() {
  if (!state.modelResult) return;
  const rows = [["date", "low", "recommended", "high", "yhat", "yhat_lower", "yhat_upper"]].concat(
    state.modelResult.future.map((row) => [
      formatDate(row.ds),
      row.yhatLower.toFixed(2),
      row.yhat.toFixed(2),
      row.yhatUpper.toFixed(2),
      row.yhat.toFixed(2),
      row.yhatLower.toFixed(2),
      row.yhatUpper.toFixed(2),
    ]),
  );
  downloadCsv("sales_forecast.csv", rows);
}

function downloadDataTemplate() {
  const rows = [
    ["date", "quantity", "order_count", "revenue", "unit_price", "discount", "country", "market", "channel", "sku", "category", "campaign", "event_name", "note"],
    ["2026-01-01", "120", "86", "15999.00", "133.33", "0.10", "US", "NAM", "Amazon", "CB-MAT-001", "Mattress", "New Year", "New Year", lt("示例：按日、周或月聚合均可，但同一文件保持同一种频率", "Example: daily, weekly, or monthly aggregation is fine, but keep one frequency per file")],
    ["2026-01-02", "98", "72", "12990.00", "132.55", "0.00", "US", "NAM", "Shopify", "CB-MAT-001", "Mattress", "", "", lt("quantity/revenue/order_count 至少保留一个作为预测指标", "Keep at least one of quantity, revenue, or order_count as the forecast metric")],
  ];
  downloadCsv("free_sales_forecast_template.csv", rows);
}

function modelDatasetRows(result, modelId) {
  const comparisonModel = (result.modelComparison?.models || []).find((model) => model.id === modelId);
  const fittedModel = (result.historicalModelFits || []).find((model) => model.id === modelId);
  const futureModel = (result.futureModelForecasts || []).find((model) => model.id === modelId);
  const selectedId = selectedModelId(result.params.forecastModel);
  const modelName = comparisonModel?.name || fittedModel?.name || futureModel?.name || modelLabel(modelId);
  const metrics = comparisonModel?.metrics || {};
  const rows = [[
    "model_id",
    "model_name",
    "row_type",
    "period",
    "date",
    "actual",
    "fitted",
    "backtest_forecast",
    "forecast",
    "low",
    "recommended",
    "high",
    "abs_error",
    "pct_error",
    "wape",
    "mape",
    "mae",
    "rmse",
    "note",
  ]];
  const metricCols = [
    metrics.wape !== undefined ? (metrics.wape * 100).toFixed(4) : "",
    metrics.mape !== undefined ? (metrics.mape * 100).toFixed(4) : "",
    metrics.mae !== undefined ? metrics.mae.toFixed(4) : "",
    metrics.rmse !== undefined ? metrics.rmse.toFixed(4) : "",
  ];

  (fittedModel?.values || []).forEach((row) => {
    const absError = row.actual === null || row.actual === undefined ? "" : Math.abs(row.actual - row.value).toFixed(4);
    rows.push([
      modelId,
      modelName,
      "history_fit",
      row.period,
      formatDate(row.ds),
      row.actual,
      row.value.toFixed(4),
      "",
      "",
      "",
      "",
      "",
      absError,
      row.errorPct === null ? "" : row.errorPct.toFixed(4),
      ...metricCols,
      lt("历史实际区间的拟合值；用于判断模型是否贴近真实走势", "Fitted values on historical actual periods; used to judge whether the model follows real movement"),
    ]);
  });

  const actualHoldout = result.modelComparison?.actual || [];
  (comparisonModel?.forecast || []).forEach((value, index) => {
    const actual = actualHoldout[index]?.value;
    const absError = actual === null || actual === undefined ? "" : Math.abs(actual - value).toFixed(4);
    const pctError = actual ? (Math.abs((actual - value) / actual) * 100).toFixed(4) : "";
    rows.push([
      modelId,
      modelName,
      "holdout_backtest",
      index + 1,
      actualHoldout[index] ? formatDate(actualHoldout[index].ds) : "",
      actual ?? "",
      "",
      Number.isFinite(value) ? value.toFixed(4) : "",
      "",
      "",
      "",
      "",
      absError,
      pctError,
      ...metricCols,
      lt("用最后一段历史做留出回测；推荐模型主要依据这一段误差", "Holdout backtest on the last part of history; model recommendation is mainly based on this error"),
    ]);
  });

  if (modelId === selectedId) {
    result.future.forEach((row) => {
      rows.push([
        modelId,
        modelName,
        "future_forecast",
        row.period,
        formatDate(row.ds),
        "",
        "",
        "",
        row.yhat.toFixed(4),
        row.yhatLower.toFixed(4),
        row.yhat.toFixed(4),
        row.yhatUpper.toFixed(4),
        "",
        "",
        ...metricCols,
        lt("当前主模型未来预测；包含低位、推荐位、高位", "Future forecast for the current primary model; includes low, recommended, and high values"),
      ]);
    });
  } else {
    (futureModel?.values || []).forEach((row) => {
      rows.push([
        modelId,
        modelName,
        "future_forecast",
        row.period,
        formatDate(row.ds),
        "",
        "",
        "",
        row.value.toFixed(4),
        "",
        row.value.toFixed(4),
        "",
        "",
        "",
        ...metricCols,
        lt("该模型未来中心预测；非主模型暂不计算高低区间", "Future center forecast for this model; non-primary models do not include low/high intervals"),
      ]);
    });
  }
  return rows;
}

function safeFilePart(value) {
  return String(value).replace(/[^a-z0-9_-]+/gi, "_").replace(/^_+|_+$/g, "").toLowerCase();
}

function downloadModelDataset(modelId) {
  if (!state.modelResult) return;
  const rows = modelDatasetRows(state.modelResult, modelId);
  downloadCsv(`sales_forecast_${safeFilePart(modelId)}.csv`, rows);
}

function downloadAllModelDatasets() {
  if (!state.modelResult) return;
  const modelIds = (state.modelResult.modelComparison?.models || []).filter((model) => model.metrics).map((model) => model.id);
  const header = modelDatasetRows(state.modelResult, modelIds[0] || selectedModelId(state.modelResult.params.forecastModel))[0];
  const rows = [header];
  modelIds.forEach((modelId) => rows.push(...modelDatasetRows(state.modelResult, modelId).slice(1)));
  downloadCsv("sales_forecast_all_models.csv", rows);
}

function rerunIfReady() {
  if (state.modelResult) runForecast();
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatShortDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return new Date(result.getFullYear(), result.getMonth(), result.getDate());
}

function addPeriod(date, count, cadence) {
  if (cadence.kind === "month") return addMonths(date, count * cadence.stepMonths);
  return addDays(date, count * cadence.stepDays);
}

function addMonths(date, months) {
  const day = date.getDate();
  const result = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(day, lastDay));
  return result;
}

function formatNumber(value, digits = 0) {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat(currentLocale(), { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
}

function compactNumber(value) {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat(currentLocale(), { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getCss(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function activateTab(tab) {
  document.querySelectorAll(".tab-btn").forEach((item) => item.classList.toggle("active", item.dataset.tab === tab));
  document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === tab));
}

function syncModelControls() {
  const model = els.forecastModel.value;
  document.querySelectorAll(".model-param-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.modelPanel === model);
  });
  const prophetOnly = model === "prophet";
  const holidayCapable = model === "prophet" || model === "featureMl" || model === "neuralProphet";
  document.querySelectorAll("[data-prophet-only]").forEach((el) => el.classList.toggle("is-hidden", !prophetOnly));
  document.querySelectorAll("[data-holiday-capable]").forEach((el) => el.classList.toggle("is-hidden", !holidayCapable));
  const activeTab = document.querySelector(".tab-btn.active")?.dataset.tab;
  if (!prophetOnly && activeTab === "season") activateTab("trend");
  if (!holidayCapable && activeTab === "holiday") activateTab("trend");
}

function themePreference() {
  return storedValue(STORAGE_KEYS.theme, "system");
}

function palettePreference() {
  return storedValue(STORAGE_KEYS.palette, "deep");
}

function resolvedTheme(choice) {
  if (choice === "dark" || choice === "light") return choice;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(choice = themePreference()) {
  const resolved = resolvedTheme(choice);
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themeChoice = choice;
  document.querySelectorAll("[data-theme-choice]").forEach((button) => {
    button.classList.toggle("active", button.dataset.themeChoice === choice);
  });
}

function setTheme(choice) {
  localStorage.setItem(STORAGE_KEYS.theme, choice);
  applyTheme(choice);
}

function applyPalette(choice = palettePreference()) {
  document.documentElement.dataset.palette = choice;
  document.querySelectorAll("[data-palette-choice]").forEach((button) => {
    button.classList.toggle("active", button.dataset.paletteChoice === choice);
  });
}

function setPalette(choice) {
  localStorage.setItem(STORAGE_KEYS.palette, choice);
  applyPalette(choice);
}

function sidebarCollapsedPreference() {
  return localStorage.getItem(STORAGE_KEYS.sidebarCollapsed) === "true";
}

function applySidebarCollapsed(collapsed = sidebarCollapsedPreference()) {
  document.documentElement.dataset.sidebar = collapsed ? "collapsed" : "expanded";
  els.sidebarCollapseBtn.setAttribute("aria-expanded", String(!collapsed));
  els.sidebarCollapseBtn.setAttribute("title", collapsed ? t("static.expandSidebar") : t("static.collapseSidebar"));
  els.sidebarCollapseBtn.setAttribute("aria-label", collapsed ? t("static.expandSidebar") : t("static.collapseSidebar"));
  els.sidebarCollapseIcon.textContent = collapsed ? "›" : "‹";
  els.sidebarCollapseLabel.textContent = collapsed ? t("static.expandSidebar") : t("static.collapseSidebar");
}

function toggleSidebarCollapsed() {
  const collapsed = document.documentElement.dataset.sidebar !== "collapsed";
  localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, String(collapsed));
  applySidebarCollapsed(collapsed);
  if (state.modelResult) requestAnimationFrame(() => drawChart(state.modelResult));
}

function setupOpenAvatar() {
  const storedAvatar = storedValue(STORAGE_KEYS.avatar, "");
  const appName = runtimeConfig().appDisplayName || "Free Sales Forecast";
  const avatar = AutoAvatar(runtimeConfig().avatarSeed || "open-forecast", storedAvatar, {
    shape: "circle",
    size: 96,
    title: appName,
  });
  els.avatarImages.forEach((image) => {
    image.src = avatar.src;
  });
  if (avatar.hash) {
    localStorage.setItem(STORAGE_KEYS.avatar, avatar.hash);
    els.avatarHashLabel.textContent = avatar.hash.slice(0, 18);
    els.avatarHashLabel.title = avatar.hash;
  }
}

function closeUserMenu() {
  els.userMenu.hidden = true;
  els.userMenuBtn.setAttribute("aria-expanded", "false");
}

function toggleUserMenu() {
  const willOpen = els.userMenu.hidden;
  els.userMenu.hidden = !willOpen;
  els.userMenuBtn.setAttribute("aria-expanded", String(willOpen));
}

function handleUserMenuAction(action) {
  if (action === "profile") {
    setStatus(null, "idle", {}, t("common.comingSoon"));
  }
  if (action === "logout") {
    setStatus(null, "idle", {}, t("common.comingSoon"));
  }
  closeUserMenu();
}

els.csvFile.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  loadCsv(await file.text(), file.name);
});

document.querySelectorAll(".tab-btn").forEach((button) => {
  button.addEventListener("click", () => {
    activateTab(button.dataset.tab);
  });
});

els.loadSampleBtn.addEventListener("click", () => loadCsv(sampleCsv, currentLocale() === "zh-CN" ? "示例销售数据" : "sample sales data"));
els.runBtn.addEventListener("click", runForecast);
els.sidebarCollapseBtn.addEventListener("click", toggleSidebarCollapsed);
els.downloadBtn.addEventListener("click", downloadForecast);
els.downloadTemplateBtn.addEventListener("click", downloadDataTemplate);
els.userMenuBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleUserMenu();
});
els.userMenu.addEventListener("click", (event) => {
  event.stopPropagation();
  const themeButton = event.target.closest("[data-theme-choice]");
  if (themeButton) setTheme(themeButton.dataset.themeChoice);
  const paletteButton = event.target.closest("[data-palette-choice]");
  if (paletteButton) setPalette(paletteButton.dataset.paletteChoice);
  const actionButton = event.target.closest("[data-menu-action]");
  if (actionButton) handleUserMenuAction(actionButton.dataset.menuAction);
});
document.addEventListener("click", closeUserMenu);
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (themePreference() === "system") applyTheme("system");
});
els.modelComparison.addEventListener("click", (event) => {
  const modelButton = event.target.closest("[data-model-download]");
  if (modelButton) {
    downloadModelDataset(modelButton.dataset.modelDownload);
    return;
  }
  if (event.target.closest("[data-download-all-models]")) downloadAllModelDatasets();
});
els.groupColumn.addEventListener("change", () => {
  updateGroupFilter();
  rerunIfReady();
});
els.groupFilter.addEventListener("change", rerunIfReady);
els.dateColumn.addEventListener("change", rerunIfReady);
els.valueColumn.addEventListener("change", rerunIfReady);
els.forecastModel.addEventListener("change", () => {
  syncModelControls();
  rerunIfReady();
});
els.holidayCountry.addEventListener("change", () => {
  renderHolidayTemplatePreview(els.holidayCountry.value);
  rerunIfReady();
});
els.clearExperimentsBtn.addEventListener("click", () => {
  state.experiments = [];
  renderExperiments();
});

[els.growth, els.horizon, els.forecastCadenceUnit, els.forecastStep, els.changepointRange, els.cap, els.floor, els.seasonalityMode, els.seasonalityPriorScale, els.intervalWidth, els.uncertaintySamples, els.weekly, els.weeklyOrder, els.monthly, els.monthlyOrder, els.quarterly, els.quarterlyOrder, els.yearly, els.yearlyOrder, els.clipZero, els.holidayPriorScale, els.holidayLowerWindow, els.holidayUpperWindow, els.etsAuto, els.etsAlpha, els.etsBeta, els.etsPhi, els.sarimaLag, els.sarimaAr, els.featureLag, els.featureRolling, els.featureEvents, els.neuralLag, els.neuralSeasonWeight, els.neuralEvents, els.nbeatsTrendDegree, els.nbeatsSeasonLag, els.movingAverageWindow, els.seasonalNaiveLag, els.eventDates].forEach((el) => {
  el.addEventListener("change", rerunIfReady);
});

els.changepoints.addEventListener("input", () => {
  els.changepointsValue.textContent = els.changepoints.value;
});
els.changepointPriorScale.addEventListener("input", () => {
  els.changepointPriorScaleValue.textContent = formatNumber(rangeScale(els.changepointPriorScale.value), 2);
});
els.changepoints.addEventListener("change", rerunIfReady);
els.changepointPriorScale.addEventListener("change", rerunIfReady);

window.addEventListener("resize", () => {
  if (state.modelResult) drawChart(state.modelResult);
});
window.addEventListener("free-sales-forecast:locale-changed", refreshForLocaleChange);

applyTheme();
applyPalette();
setupOpenAvatar();
setupHelpTooltips();
syncModelControls();
applyStaticI18n();
renderHolidayTemplatePreview(els.holidayCountry.value);
drawEmpty();
setStatus("status.idle", "idle");
