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

            // let profiles = [];

            const industriesToProcess = await Industry.find({}, { _id: false, name: true }).lean() as string[];

            /*
            Batch query fundamentals (500)

            Paralleize every batch with node events
            */

            for (let i = 0; i < industriesToProcess.length; i++) {

                const industry = industriesToProcess[i];

                console.log(`Profiling ${industry}`);
            }

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
