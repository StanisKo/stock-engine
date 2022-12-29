import { ServiceResponse } from '../../dtos/serviceResponse';

import { ApiConnectorService } from './api-connector.service';

import { DataParserService } from './data-parser.service';

/*
TODO: This should be an ingesting service; stock profiling should be mapped to a different
endpoint and start a separate profiling process AFTER the ingest (write to disk) is done
*/
export class StockProfilingService {

    apiConnectorService: ApiConnectorService;

    dataParserService: DataParserService;

    constructor() {

        this.apiConnectorService = new ApiConnectorService();
    }

    public async profileStocks(): Promise<ServiceResponse> {

        const response = new ServiceResponse();

        try {

            await this.apiConnectorService.ingestBulkFundamentalsData();

            response.success = true;
        }
        catch (error) {
            console.log(error);

            response.success = false;

            response.message = 'Failed to ingest bulk data';
        }

        return response;
    }
}
