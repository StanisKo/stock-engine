# Stock Profiles

<br />

Engine revolves around so-called Stock Profiles: a set of measurements and ratios
sculpted for every stock based on prices, risk-free rates, benchmarks, and issuer's financial papers -- balance sheet, income statement and cash flow statement.

<br />

Aforementioned measurements and ratios are commonly known as *fundamentals* -- values that help evaluate the companies behind each stock.

<br />

Each set of fundamentals (profile) is divided into 6 categories:

* Risk

* Valuation

* Profitability

* Liquidity

* Debt

* Efficiency

<br />

*N.B.*: We also gauge data on dividends, but this does not influence engine's output (yet) and at this point in time kept strictly for curiosity.

<br />

### Ratios of Each Category and Their Purposes:

<br />

<b>Risk</b>

<br />

Risk category includes following rations:

<br />

* *Standard Deviation*

  Indicates how much the current return on the stock is deviating from its expected historical normal returns.

  The higher standard deviation, the greater possible outcomes, both negative and positive.

  In such, we're looking for HIGHEST Standard Deviation since we need stocks that can potentially outperform their expected historical normal returns.

  <br />

  Target: > Industry Peers

  <br />

  Formula:

  <br />

  ```
  SD = SQRT(V)

  Where SD is Standard Deviation and V is Variance

  V = SUM(RoR - ARoR) ^ 2 / N(RoR) - 1

  Where RoR is Rate of Return and ARoR is Average Rate of Return

  RoR = (P2 - P1) / P1 * 100

  Where P2 is Nth price and P1 is previous (we calculate daily RoR over whole dataset of prices since IPO)

  ARoR = SUM(RoR) / N(RoR)

  Where N is count of datapoints we have
  ```

  <br />

  On Standard Deviation: https://www.investopedia.com/terms/s/standarddeviation.asp

<br />

# 3-rd Party APIs

<br />

Engine uses following data sources:

<br />

An open-source library to fetch stocks' historical prices and benchmark prices from Yahoo Finance.

The choice of benchmark in our case is S&P500 (Standard and Poor 500) index that hosts 500 largest US companies.
It is a common proxy of measuring stocks against the broader market.

<br />

A free NASDAQ API to fetch risk-free rates.

The choice of risk-free asset in our case is US Treasury 1 Year Bond.

<br />

A paid API (eodhistoricaldata.com) that delivers bulk fundamentals and financial documents.

<br />

# Flow & Output

Engine:

1. Ingests bulk data on every ticker avaialable from API.

2. Fetches benchmark prices and risk-free rate (bond yield).

3. Groups ingested data by industries.

4. For every stock extracts ratios available from the provider and calculates missing based on aforementioned sources -- creates profiles.

<br />

*N.B.: Fundamentals must always be compared within the same industry!*

<br />

5. Therefore: for each stock in each industry, compares profiles against each other and assigns them an arbitrary score between 0 and 100.

6. Outputs stocks sorted by scores, where top are stocks that have highest potential to be profitable and bottom are those that are least promising, <b>across all industries</b>.

*In such, top is used to create diverse portfolio of long-term investments and bottom is used to identify short-selling targets aimed at quick gains.*