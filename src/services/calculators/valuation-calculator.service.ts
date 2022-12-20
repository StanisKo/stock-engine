/*
EV/R = EV / Revenue

EV/EBITDA = EV / EBITDA

EV = Market Cap + Debt - CC

Debt = Short-Term Debt + Long-Term Debt

CC = Cash + Cash (And) Equivalents

NOTE: API provides Debt as shortLongTermDebtTotal

P/CF = SP / OCF per Share

SP = Stock Price

OCF = Operating Cash Flow

* In order to avoid volatility in calculations, we must use average stock price over last 30 days

* OCF per Share is calculated by dividing Operating Cash Flow by number of outstanding shares

NOTE: API provides Operating Cash Flow as totalCashFromOperatingActivities

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

    static calculatePriceToCashFlow(operatingCashFlow: number, outstandingShares: number, price: number): number {

        const operatingCashFlowPerShare = operatingCashFlow / outstandingShares;

        return price / operatingCashFlowPerShare;
    }
}
