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

*N.B.*: We also gauge data on dividends, but this does not influence engine's outpus and at this point in time kept strictly for curiosity.

<br />

Purposes of each category:

* Risk 

<br />

Engine makes use of several third-party APIs to fetch stocks' financial data, creates profiles and sorts stocks within the same industry, delivering (potentially) most profitable stocks for each industry

<br />

Then, most most profitable stocks per industry are sorted against each other to arrive to most profitable
stocks on the market