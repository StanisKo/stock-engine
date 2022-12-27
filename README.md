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

* *R-Squared*

  Measures how much the movement of the assets is influenced by the movement of the index. Ranges from 0 to 100 (percent).

  We're looking for LOWEST R-Squared since we need stocks that deviate from the market (index).

  <br />

  Target: < 70% && < Industry Peers

  <br />

  Formula:
  ```
  NOTE: We're using correlation-based formula to calculate r-squared:

  R-Squared = r^2

  r (Correlation) = Covariance(TR, TB) / SD of TR * SD of BR

  Covariance = N * SUM(TR * BR) - SUM(TR) * SUM(BR)

  Where TR is Ticker Returns

  Where BR is Benchmark Returns

  Where SD is Standard Deviation

  Where N is Dataset Size
  ```

  <br />

  On R-Squared: https://www.investopedia.com/terms/r/r-squared.asp

  On Correlation: https://www.investopedia.com/terms/c/correlationcoefficient.asp

  On Covariance: https://www.investopedia.com/terms/c/covariance.asp

<br />

<b>Valuation</b>

<br />

* *Price to Earnings*

  Denotes the price paid for $1 of earnings.

  In other words: how much stock price relates to company's earnings.

  Rule of thumb — stocks trading at a lower P/E ratio than their industry peers are considered value stocks.

  We're looking for LOWEST P/E, since we need stocks that are undervalued for their perfomance.

  <br />

  Target: < Industry Peers

  <br />

  ```
  No formula: P/E ratio is available directly from API
  ```

  <br />

  On Price to Earnings: https://www.investopedia.com/terms/p/price-earningsratio.asp

<br />

* *Price to Earnings Growth*

  Helps to understand future growth prospects of the company and its stock.
  
  The lower the number, the better.

  We're looking for LOWEST PEG, since we need stocks that are undervalued for their potential performance.

  <br />

  Target: < 1.0 && < Industry Peers

  <br />

  ```
  No formula: PEG ratio is available directly from API
  ```

  <br />

  On Price to Earnings Growth: https://www.investopedia.com/terms/p/pegratio.asp

<br />

* *Price to Sales*

  Denotes the price paid for $1 of sales.

  Reflects how good stock performs against the sales operations of the business.

  We're looking for LOWEST P/S, since we need stocks that are undervalued for their sales operations.

  <br />

  Target: < Industry Peers

  <br />

  ```
  No formula: P/S ratio is available directly from API
  ```

  <br />

  On Price to Sales: https://www.investopedia.com/terms/p/price-to-salesratio.asp

  <br />

* *Price to Book*

  Denotes the price you pay for $1 of equity, a.k.a. book value (assets - liabilities).

  Reflects how stock is priced against company’s actual worth.

  We're looking for LOWEST P/B, since we need stocks that are undervalues for their value as a company.

  <br />

  Target: < 1.0 && < Industry Peers

  <br />

  ```
  No formula: P/B ratio is available directly from API
  ```

  <br />

  On Price to Book: https://www.investopedia.com/terms/p/price-to-bookratio.asp

  <br />

* *Enterprise Value to Revenue*

  Denotes the total enterprise worth in comparison to its revenue.

  One of several fundamental indicators that investors use to determine whether a stock is priced fairly.

  The lower the better, in that, a lower EV/R signals a company is undervalued.

  NOTE: similar to P/B, yet used more to evaluate early-stage/growth companies that might not have much of assets behind them

  We're looking for LOWEST EV/R, since we need stocks that are undervalues for their value as a company.

  <br />

  Target: > 1 && < 3 && < Industry Peers

  <br />

  Formula
  ```
  EV/R = EV / Revenue

  Where EV is Enterprise Value

  EV = Market Capitalization + Debt - Cash - Cash Equivalents
  ```

  <br />

  On Enterprise Value to Revenue: https://www.investopedia.com/terms/e/ev-revenue-multiple.asp

  <br />

* *Enterprise Value to EBITDA*

  Denotes the total enterprise worth in comparison to its EBITDA.

  Similar to EV/R, but is more conservative.

  We're looking for LOWEST EV/EBITDA, since we need stocks that are undervalues for their earnings.

  <br />

  Target: < 10 && < Industry Peers

  <br />

  Formula
  ```
  EV/EBITDA = EV / EBITDA

  *Check EV/R
  ```

  <br />

  On Enterprise Value to EBITDA: https://www.investopedia.com/terms/e/ev-ebitda.asp

  <br />

* *Price to Free Cash Flow*

  Measures how much cash company is generating relative to its market value (its stock price).

  A good alternative to P/E as cash flows are less susceptible to manipulation than earnings.

  Particularly useful for stocks that have positive cash flow but are not profitable yet.

  We're looking for LOWEST P/FCF, since we need stocks that are undervalued for their free cash flow

  <br />

  Target: < 5 && < Industry Peers

  <br />

  Formula:
  ```
  P/FCF = SP / FCF

  SP = Stock Price

  FCF = Free Cash Flow (Per Share)

  In order to avoid volatility in calculations, we use average stock price over last 60 trading days.

  FCF is calculated by dividing Free Cash Flow by number of outstanding shares.

  We do not use original P/FCF formula (Market Cap / Free Cash Flow), since market cap is inherently
  bound to latest stock price.

  Yet, since we want to smooth out volatility and produce more conservative number
  we use P/CF formula and swap Operating Cash Flow per share for Free Cash Flow per share.

  Reason is that P/CF can also be calculated as Market Cap / Operating Cash Flow, therefore,
  we can safely calculate P/FCF by using Free Cash Flow Per Share and Stock Price.
  ```

  <br />

  On Price to Free Cash Flow: https://www.investopedia.com/terms/p/pricetofreecashflow.asp

  On Price to (Operating) Cash Flow: https://www.investopedia.com/terms/p/price-to-cash-flowratio.asp

  <br />

<b>Profitability</b>

<br />

* *Return on Assets*

  Displays how effectively the company is using its assets to generate income.

  The higher the number, the better.

  We're looking for HIGHEST ROA, since we need stocks that have the highest potential to be profitable based on company's assets.

  <br />

  Target: > Industry Peers

  <br />

  ```
  No formula: ROA is available directly from API
  ```

  <br />

  On Return on Assets: https://www.investopedia.com/terms/r/returnonassets.asp

  <br />

* *Return on Equity*

  Displays how effective the company is using its investment from shareholders to generate income.

  The higher the number, the better.

  We're looking for HIGHEST ROE, since we need stocks that have the highest potential to be profitable based on capital gained from issued shares.

  <br />

  Target: > Industry Peers

  <br />

  ```
  No formula: ROE is available directly from API
  ```

  <br />

  On Return on Equity: https://www.investopedia.com/terms/r/returnonequity.asp

  <br />

* *Profit Margin*

  Denotes how much profit company makes after deducting liabilites.

  We're looking for HIGHEST Profit Margin, since we need stocks that have the highest potential to be profitable based on company's operations.

  <br />

  Target: > Industry Peers

  <br />

  ```
  No formula: Profit Margin is available directly from API
  ```

  <br />

  On Profit Margin: https://www.investopedia.com/terms/p/profitmargin.asp

  <br />

<b>Liquidity</b>

<br />

* *Current Ratio*

  Denotes company’s capacity to meet it’s short-term obligations (debt), where short-term obligations are debt due within 1 year period.

  We're looking for HIGHEST Current Ratio, since we need stocks whose companies are safe from the prospects of bancruptcy.

  <br />

  Target: > Industry Peers

  <br />

  Formula:
  ```
  Current Ratio = Current Assets / Current Liabilities
  ```

  <br />

  On Current Ratio: https://www.investopedia.com/terms/c/currentratio.asp

  <br />

* *Quick Ratio*

  Similar to Current Ratio, but is more conservative. As a rule, lower than Current Ratio.

  We're looking for HIGHEST Quick Ratio (see Current Ratio).

  <br />

  Target: > Industry Peers

  <br />

  Formula:
  ```
  Quick Ratio = Quick Assets / Current Liabilities

  Quick Assets = Cash + Cash Equivalents + Marketable Securities + Net Receivables
  ```

  <br />

  On Quick Ratio: https://www.investopedia.com/terms/q/quickratio.asp

  On Marketable Securities: https://www.investopedia.com/terms/m/marketablesecurities.asp

  On Quick Assets: https://www.investopedia.com/terms/q/quickratio.asp

  <br />

<b>Debt</b>

<br />

* *Debt to Equity*

  Measures the relationship between the amount of capital that has been borrowed (debt), and the amount of capital contributed by shareholders (equity).
  
  Displays company’s ability to service it’s long-term debt obligations.
  
  The lower the number, the better.

  We're looking for LOWEST D/E since we need stocks whose companies have sensible leverage and are not burdened by debt.

  <br />

  Target: < Industry Peers

  <br />

  Formula:
  ```
  Debt to Equity = Total Liabilities / Total Stockholder Equity
  ```

  <br />

  On Debt to Equity: https://www.investopedia.com/terms/d/debtequityratio.asp

  <br />

* *Interest Coverage*

  Measures how easily a company can pay interest on its outstanding debt.

  It represents how many (typically the number of quarters or fiscal years) times the company can pay its obligations using its earnings.

  The higher the number, the better.

  We're looking for HIGHEST Interest Coverage, since we need stocks whose companies make enough money to service their long-term debt.

  <br />

  Target: > 1.0 && > Industry Peers

  <br />

  Formula:
  ```
  Interest Coverage = EBIT / Interest Expense
  ```

  <br />

  On Interest Coverage: https://www.investopedia.com/terms/i/interestcoverageratio.asp

  <br />

<b>Efficiency</b>

<br />

* *Asset Turnover*

  Measures how good the company is at using its assets to sell its products.

  In other words: how fast the company is turning over assets in relation to sales; for every $1 of assets it owns, how much $N it can generate in sales each year.

  The higher the number, the better.

  We're looking for HIGHEST Asset Turnover, since we need stocks whose companies generate more sales against the assets they own.

  <br />

  Target: > Industry Peers

  <br />

  Formula:
  ```
  Asset Turnover = Total Annual Sales / Average Total Assets
  ```

  <br />

  On Asset Turnover: https://www.investopedia.com/terms/a/assetturnover.asp

  <br />

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