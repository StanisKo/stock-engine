# Core

<br />

Engine revolves around so-called Stock Profiles: a set of measurements and ratios
sculpted for every stock based on prices, risk-free rates, benchmarks, and issuer's financial papers -- balance sheet, income statement and cash flow statement.

<br />

Aforementioned measurements and ratios are commonly known as *fundamentals* -- values that help evaluate the companies behind each stock.

<br />

All fundamentals that form profiles must be compared within the same industry.

<br />

Engine, therefore, sculpts profiles for each stock in each industry available from the API, compares profiles ratio-by-ratio and scores them by assigning an arbitrary number between 0 and 100.

<br />

These scores then yield a sorted output where top are stocks that have highest potential to be profitable and bottom are those that are least promising, <b>across all industries</b>.

<br />

*In such, top is used to create diverse portfolio of long-term investments and bottom is used to identify short-selling targets aimed at quick gains.*

<br />

# Stock Profiles

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

* *Sharpe Ratio*

  Measures rate of return on the asset above risk-free investment, such as treasury bonds or cash.

  In other words, measures whether the risk is justified against investing into risk-free assets.

  A Sharpe Ratio above 1.0 is considered good, as it indicates potential excess return
  relative to the volatility of the asset.

  We're looking for HIGHEST Sharpe Ratio since we need stocks that justify the risk involved.

  <br />

  Target: > 1.0 && > Industry Peers

  <br />

  Formula:

  ```
  SR = (Ticker RoR - Risk-Free RoR) / Ticker SD


  Where Risk-Free RoR is Rate of Return on Risk-Free Asset -- US Treasury 1 Year Bond Yield
  ```

  <br />

  On Sharpe Ratio: https://www.investopedia.com/terms/s/sharperatio.asp

<br />

* *Beta*

  Measures volatility of an asset against the broader index (S&P 500, Dow Jones, Nasdaq, etc.).

  Displays the intensity of movement, not the direction: the asset moves in the same direction as index,
  either slower, same, or faster.

  We're looking for HIGHEST Beta since we need stocks that have potential to grow faster than the market.

  <br />

  Target: > 1.0 && > Industry Peers

  <br />

  ```
  No formula: Beta is available directly from API
  ```

  <br />

  On Beta: https://www.investopedia.com/terms/b/beta.asp

<br />

* *Alpha*

  Measures excess returns/losses against the return of the index.

  Expressed in a decimal (0.N) that is a percentage of over or under performance.

  <b>NOTE:</b> we express alpha in direct percentage.

  We're looking for HIGHEST Alpha since we need stocks that outperform the market (index).

  <br />

  Target: > 0 && > Industry Peers

  <br />

  Formula:
  ```
  Alpha = (Ticker RoR – Risk-Free RoR) – Beta * (Benchmark RoR - Ticker RoR)

  Where Benchmark RoR is Rate of Return on S&P500 index (ticker: ^GSPC)
  ```

  <br />

  On Alpha: https://www.investopedia.com/terms/a/alpha.asp


<br />

# 3-rd Party APIs

<br />

Engine uses following data sources:

<br />

1. An open-source library to fetch stocks' historical prices and benchmark prices from Yahoo Finance.

   The choice of benchmark in our case is S&P500 (Standard and Poor 500) index that hosts 500 largest US companies.

   It is a common proxy of measuring stocks against the broader market.

<br />

2. A free NASDAQ API to fetch risk-free rates.

   The choice of risk-free asset in our case is US Treasury 1 Year Bond.

<br />

3. A paid API (eodhistoricaldata.com) that delivers bulk fundamentals and financial documents.

<br />