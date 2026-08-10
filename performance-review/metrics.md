# Key Metrics to Monitor

This document defines the key metrics that should be monitored for AIArbiTech YouTube OS platform performance and health.

---

## 1. Performance Metrics

### 1.1 Request Metrics

#### Requests Per Second (RPS)
- **Description:** Number of requests processed per second
- **Target:** Monitor trends, no specific target
- **Alert Threshold:** Sudden drop >50% or spike >200%
- **Measurement:** Prometheus `rate(http_requests_total[1m])`
- **Visualization:** Time series graph with peak/average markers
- **Why Important:** Indicates platform load and capacity utilization

#### Response Time (Latency)
- **Description:** Time taken to process and respond to requests
- **Targets:**
  - p50 (median): <100ms
  - p95: <500ms
  - p99: <1000ms
- **Alert Threshold:** p95 >1s or p99 >2s
- **Measurement:** Prometheus histogram `http_request_duration_seconds`
- **Visualization:** Percentile distribution graph
- **Why Important:** Directly impacts user experience

#### Per-Endpoint Response Time
- **Description:** Response time broken down by API endpoint
- **Target:** Each endpoint <500ms p95
- **Alert Threshold:** Any endpoint p95 >1s
- **Measurement:** Prometheus histogram with `endpoint` label
- **Visualization:** Table or heatmap by endpoint
- **Why Important:** Identifies specific slow endpoints for optimization

### 1.2 Error Metrics

#### Error Rate (Overall)
- **Description:** Percentage of requests resulting in errors (4xx, 5xx)
- **Target:** <1% overall error rate
- **Alert Threshold:** >2% for 5 minutes
- **Measurement:** `rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) * 100`
- **Visualization:** Time series graph with threshold line
- **Why Important:** Indicates platform stability and reliability

#### Error Rate by Type
- **Description:** Breakdown of errors by HTTP status code
- **Targets:**
  - 4xx (client errors): <5%
  - 5xx (server errors): <0.5%
- **Alert Threshold:** 5xx >1% for 2 minutes
- **Measurement:** Prometheus with `status` label grouping
- **Visualization:** Stacked area chart by status code
- **Why Important:** Helps identify type of issues (client vs server)

#### Error Rate by Endpoint
- **Description:** Error rate broken down by API endpoint
- **Target:** Each endpoint <2% error rate
- **Alert Threshold:** Any endpoint >5% error rate
- **Measurement:** Prometheus with `endpoint` and `status` labels
- **Visualization:** Table or heatmap
- **Why Important:** Pinpoints problematic endpoints
