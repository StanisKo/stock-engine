/*
At this point in time, we do not have access to business logic that would
define weights for each ratio

In such, we deduce weights by simply averaging down each ratio against number
of ratios in given category

Same principle is applied to categories' weights: they are averaged down against
number of categories in profile
*/

export class WeightConfiguratorService {

    private averageWeightOfCategory = 100 / 7;


    private averageWeightOfRiskRatio = 100 / 5;

    private averageWeightOfValuationRatio = 100 / 7;

    private averageWeightOfProfitabilityRatio = 100 / 3;

    private averageWeightOfLiqudityRatio = 100 / 2;

    private averageWeightOfDebtRatio = 100 / 2;

    private averageWeightOfEfficiencyRatio = 100 / 2;


    public weights: { [key: string]: number } = {

        /*
        We treat CAGR as a separate category
        */
        cagr: this.averageWeightOfCategory,

        risk: this.averageWeightOfCategory,

        valuation: this.averageWeightOfCategory,

        profitability: this.averageWeightOfCategory,

        liquidity: this.averageWeightOfCategory,

        debt: this.averageWeightOfCategory,

        efficiency: this.averageWeightOfCategory,


        standardDeviation: this.averageWeightOfRiskRatio,

        sharpeRatio: this.averageWeightOfRiskRatio,

        beta: this.averageWeightOfRiskRatio,

        alpha: this.averageWeightOfRiskRatio,

        rSquared: this.averageWeightOfRiskRatio,


        priceToEarnings: this.averageWeightOfValuationRatio,

        priceToEarningsGrowth: this.averageWeightOfValuationRatio,

        priceToSales: this.averageWeightOfValuationRatio,

        priceToBook: this.averageWeightOfValuationRatio,

        enterpriseValueToRevenue: this.averageWeightOfValuationRatio,

        enterpriseValueToEbitda: this.averageWeightOfValuationRatio,

        priceToFreeCashFlow: this.averageWeightOfValuationRatio,


        returnOnAssets: this.averageWeightOfProfitabilityRatio,

        returnOnEquity: this.averageWeightOfProfitabilityRatio,

        profitMargin: this.averageWeightOfProfitabilityRatio,


        currentRatio: this.averageWeightOfLiqudityRatio,

        quickRatio: this.averageWeightOfLiqudityRatio,


        debtToEquity: this.averageWeightOfDebtRatio,

        interestCoverage: this.averageWeightOfDebtRatio,


        assetTurnover: this.averageWeightOfEfficiencyRatio,

        inventoryTurnover: this.averageWeightOfEfficiencyRatio
    };
}
