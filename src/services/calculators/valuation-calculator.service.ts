import { Discard } from '../../utils/discard.decorator';

/*
P/E = SP / EPS

SP = Stock Price

EPS = Earnings Per Share

EV/R = EV / Revenue

EV/EBITDA = EV / EBITDA

EV = Market Cap + Debt - CC

Debt = Short-Term Debt + Long-Term Debt

CC = Cash + Cash (And) Equivalents

NOTE: API provides Debt as shortLongTermDebtTotal

P/FCF = SP / FCF

SP = Stock Price

FCF = Free Cash Flow (Per Share)

In order to avoid volatility in calculations, we use average stock price over last 60 trading days

FCF is calculated by dividing Free Cash Flow by number of outstanding shares

We do not use original P/FCF formula (Market Cap / Free Cash Flow), since market cap is inherently
bound to latest stock price

Yet, since we want to smooth out volatility and produce more conservative number
we use P/CF formula and swap Operating Cash Flow per share for Free Cash Flow per share

Reason is that P/CF can also be calculated as Market Cap / Operating Cash Flow, therefore,
we can safely calculate P/FCF by using Free Cash Flow Per Share and Stock Price

****

On EV/R: https://www.investopedia.com/terms/e/ev-revenue-multiple.asp

On EV/EBITDA: https://www.investopedia.com/terms/e/ev-ebitda.asp

On P/FCF: https://www.investopedia.com/terms/p/pricetofreecashflow.asp

On P/CF: https://www.investopedia.com/terms/p/price-to-cash-flowratio.asp
*/

export class ValuationCalculatorService {

    static enterpriseValue: number;

    @Discard
    public static calculatePriceToEarnings(
        stockPrice: number, netIncome: number, sharesOutstanding: number, exchangeRate?: number): number {

        let earningsPerShare = netIncome / sharesOutstanding;

        /*
        If financial documents are exposed not in USD, we got to convert EPS into USD
        and only then calculate P/E (since price is always in USD)
        */
        if (exchangeRate) {

            /*
            Our ecxhange rate is reversed (CURR/USD), so we divide
            */
            earningsPerShare /= exchangeRate;
        }

        return stockPrice / earningsPerShare;
    }

    /*
    We calculate PEG based on growth estimated over the next year (+1y)
    */
    @Discard
    public static calculatePriceToEarningsGrowth(priceToEarnings: number, earningsGrowth: number): number {

        return priceToEarnings / earningsGrowth;
    }

    @Discard
    public static calculateEnterpriseValue(
        marketCap: number, debt: number, cash: number, cashAndEquivalents: number): void {

        ValuationCalculatorService.enterpriseValue = marketCap + debt - cash - cashAndEquivalents;
    }

    @Discard
    public static calculateEVR(revenue: number): number {

        return ValuationCalculatorService.enterpriseValue / revenue;
    }

    @Discard
    public static calculateEVEBITDA(ebitda: number): number {

        return ValuationCalculatorService.enterpriseValue / ebitda;
    }

    @Discard
    public static calculatePriceToFreeCashFlow(freeCashFlow: number, sharesOutstanding: number, price: number): number {

        const freeCashFlowPerShare = freeCashFlow / sharesOutstanding;

        return price / freeCashFlowPerShare;
    }
}
