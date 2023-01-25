import { IFundamentals } from '../../interfaces/fundamentals.interface';

import { IStockProfile } from '../../interfaces/stock-profile.interface';

import { DataServiceResponse } from '../../dtos/serviceResponse';

import { Fundamentals } from '../../schemas/fundamentals.schema';

import { ApiConnectorService } from '../core/api-connector.service';

import { StockParserService } from '../parsers/stock-parser.service';

export class SingleStockProfilingService {

    public async profileStock(ticker: string): Promise<DataServiceResponse<IStockProfile>> {

        const response = new DataServiceResponse<IStockProfile>();

        try {

            const fundamentals: IFundamentals = await Fundamentals.findOne({ ticker }).lean();

            if (!fundamentals) {

                response.success = false;

                response.message = 'No fundamentals available for provided ticker';

                return response;
            }

            const prices = await ApiConnectorService.requestTickerPrices(ticker);

            if (!prices) {

                response.success = false;

                response.message = 'No prices available for provided ticker';

                return response;
            }

            const benchmarkPrices = await ApiConnectorService.requestBenchmarkPrices();

            const treasuryBondYield = await ApiConnectorService.requestUSTreasuryBondYield();

            /*
            If financial documents are exposed not in USD, we have to grab exchange rate
            for set's currency, since some calculations factor in price (which is always expressed in USD)
            */
            let exchangeRate;

            const figuresExpressedIn = fundamentals.data.Financials.Balance_Sheet.yearly_last_0.currency_symbol;

            if (figuresExpressedIn !== 'USD') {

                exchangeRate = await ApiConnectorService.requestExchangeRateAgainstUSD(
                    figuresExpressedIn
                );
            }

            const stockParserService = new StockParserService(
                fundamentals.data,
                prices,
                benchmarkPrices,
                treasuryBondYield,
                exchangeRate
            );

            const stockProfile = stockParserService.parseStockProfile();

            response.success = true;

            response.data = stockProfile;
        }
        catch (error) {

            console.log(error);

            response.success = false;

            response.message = 'Failed to profile stock';
        }

        return response;
    }
}
