/*
At this point in time, we do not have access to business logic that would
define weights for each ratio

In such, we deduce weights by simply averaging down each ratio against number
of ratios in given category

Same principle is applied to categories' weights: they are averaged down against
number of categories in profile
*/

export class WeightConfiguratorService {

    private static averageWeightOfCategory = 100 / 6;

    private static averageWeightOfRiskRatio = 100 / 5;

    private static averageWeightOfValuationRatio = 100 / 7;

    /*
    We treat CAGR as a separate category
    */
    public static cagr = this.averageWeightOfCategory;

    public static risk = this.averageWeightOfCategory;

    public static valuation = this.averageWeightOfCategory;

    public static profitability = this.averageWeightOfCategory;

    public static liquidity = this.averageWeightOfCategory;

    public static debt = this.averageWeightOfCategory;

    public static efficiency = this.averageWeightOfCategory;


    public static standardDeviation = this.averageWeightOfRiskRatio;

    public static sharpeRatio = this.averageWeightOfRiskRatio;

    public static beta = this.averageWeightOfRiskRatio;

    public static alpha = this.averageWeightOfRiskRatio;

    public static rSquared = this.averageWeightOfRiskRatio;


    public static priceToEarnings = this.averageWeightOfValuationRatio;

    public static priceToEarningsGrowth = this.averageWeightOfValuationRatio;

    public static priceToSales = this.averageWeightOfValuationRatio;

    public static priceToBook = this.averageWeightOfValuationRatio;

    public static enterpriseValueToRevenue = this.averageWeightOfValuationRatio;

    public static enterpriseValueToEbitda = this.averageWeightOfValuationRatio;

    public static priceToFreeCashFlow = this.averageWeightOfValuationRatio;
}
