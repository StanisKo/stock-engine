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

*N.B.*: We also gauge data on dividends, but this does not influence engine's output and at this point in time kept strictly for curiosity.

<br />

### Purposes of each category:

<br />

WIP (aggregate interface comments)

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

The choice of risk-free asset in our case is US Treasury 1 Year Bond Yield.

<br />

A paid API (eodhistoricaldata.com) that delivers bulk fundamentals and financial documenents.

<br />

# Flow & Output

create profiles -> score profiles -> find most and least profitable stock per industry and, therefore, on the market

This then helps to create diverse portfolio of winning stocks across the market