import { Industry } from '../../schemas/industry.schema';

import { Fundamentals } from '../../schemas/fundamentals.schema';

import { ServiceResponse } from '../../dtos/serviceResponse';

import { ApiConnectorService } from './api-connector.service';

import { DataParserService } from './data-parser.service';

export class StockProfilingService {

    apiConnectorService: ApiConnectorService;

    dataParserService: DataParserService;

    constructor() {

        this.apiConnectorService = new ApiConnectorService();
    }

    public async profileStocks(): Promise<ServiceResponse> {

        const response = new ServiceResponse();

        try {

            /*
            Request benchmark prices, treasury bondy yield
            */

            /*
            Query fundamentals and batch, or batch query and keep track of offset?

            for batch in batches:

                worker.process(batch):

                    for ticker in batch:

                        Request ticker pricess

                        parser.parse(ticker, tickerPrices, benchmarkPrices, treasuryBondYield)
            */

            response.success = true;
        }
        catch (error) {

            console.log(error);

            response.success = false;

            response.message = 'Failed to profile ingested stocks';
        }

        return response;
    }
}
