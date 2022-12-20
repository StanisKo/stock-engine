/*
EV/R = EV / Revenue

EV/EBITDA = EV / EBITDA

EV = Market Cap + Debt - CC

Debt = Short-Term Debt + Long-Term Debt

CC = Cash + Cash (And) Equivalents

NOTE: API provides Debt as shortLongTermDebtTotal

P/CF = SP / OCF

SP = Stock Price

OCF = Operating Cash Flow per Share

* In order to avoid volatility in calculations, we must use average stock price over last 30 days

* OCF is calculated over TTM OCFs divided by number of outstanding shares

****

On EV/R: https://www.investopedia.com/terms/e/ev-revenue-multiple.asp

On EV/EBITDA: https://www.investopedia.com/terms/e/ev-ebitda.asp

On P/CF: https://www.investopedia.com/terms/p/price-to-cash-flowratio.asp
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

    static calculatePriceToCashFlow(): number {

        return 0;
    }
}
