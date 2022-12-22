/*
EV/R = EV / Revenue

EV/EBITDA = EV / EBITDA

EV = Market Cap + Debt - CC

Debt = Short-Term Debt + Long-Term Debt

CC = Cash + Cash (And) Equivalents

NOTE: API provides Debt as shortLongTermDebtTotal

P/CF = SP / FCF

SP = Stock Price

FCF = Free Cash Flow Per Share

* FCF is calculated by dividing Free Cash Flow by number of outstanding shares

* In order to avoid volatility in calculations, we use average stock price over last 60 days

NOTE: We use Free Cash Flow and not Operating Cash Flow, since Free Cash Flow does not include CAPEX
(Capital Expenditures) and, therefore, is more conservative measure

****

On EV/R: https://www.investopedia.com/terms/e/ev-revenue-multiple.asp

On EV/EBITDA: https://www.investopedia.com/terms/e/ev-ebitda.asp

On P/CF: https://www.investopedia.com/terms/p/price-to-cash-flowratio.asp

On FCF: https://www.investopedia.com/ask/answers/033015/what-formula-calculating-free-cash-flow.asp
*/

export class ValuationCalculatorService {

    static enterpriseValue: number;

    static calculateEnterpriseValue(marketCap: number, debt: number, cash: number, cashAndEquivalents: number): void {

        ValuationCalculatorService.enterpriseValue = marketCap + debt - cash - cashAndEquivalents;
    }

    static calculateEVR(revenue: number): number {

        return ValuationCalculatorService.enterpriseValue / revenue;
    }

    static calculateEVEBITDA(ebitda: number): number {

        return ValuationCalculatorService.enterpriseValue / ebitda;
    }

    static calculatePriceToCashFlow(freeCashFlow: number, sharesOutstanding: number, price: number): number {

        const freeCashFlowPerShare = freeCashFlow / sharesOutstanding;

        return price / freeCashFlowPerShare;
    }
}
