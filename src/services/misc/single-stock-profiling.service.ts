import { IFundamentals } from '../../interfaces/fundamentals.interface';

import { IStockProfile } from '../../interfaces/stock-profile.interface';

import { DataServiceResponse } from '../../dtos/serviceResponse';

import { Fundamentals } from '../../schemas/fundamentals.schema';

import { ApiConnectorService } from '../core/api-connector.service';
import { StockParsingService } from '../core/stock-parsing.service';

export class SingleStockProfilingService {

    public async profileStock(ticker: string): Promise<DataServiceResponse<IStockProfile>> {

        const response = new DataServiceResponse<IStockProfile>();

        try {

            const fundamentals: IFundamentals = await Fundamentals.findOne({ 'data.General.Code': ticker }).lean();

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

            const stockParsingService = new StockParsingService(
                fundamentals.data,
                prices,
                benchmarkPrices,
                treasuryBondYield
            );

            const stockProfile = stockParsingService.parseOutStockProfile();

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
