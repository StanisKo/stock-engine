/*
EV/R = EV / Revenue

EV/EBITDA = EV / EBITDA

EV = Market Cap + Debt - CC

Debt = Short-Term Debt + Long-Term Debt

CC = Cash + Cash (And) Equivalents

NOTE: API provides Debt as shortLongTermDebtTotal

****

On EV/R: https://www.investopedia.com/terms/e/ev-revenue-multiple.asp

On EV/EBITDA: https://www.investopedia.com/terms/e/ev-ebitda.asp
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
}
