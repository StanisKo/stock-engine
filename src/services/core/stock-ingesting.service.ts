import { ServiceResponse } from '../../dtos/serviceResponse';

import { ApiConnectorService } from './api-connector.service';

export class StockIngestingService {

    apiConnectorService: ApiConnectorService;

    constructor() {

        this.apiConnectorService = new ApiConnectorService();
    }

    public async ingestStocks(): Promise<ServiceResponse> {

        const response = new ServiceResponse();

        const bulkFundamentalsData = await this.apiConnectorService.requestBulkFundamentalsData();

        

        try {

            response.success = true;
        }
        catch (error) {

            console.log(error);

            response.success = false;

            response.message = 'Failed to ingest fundamentals';
        }

        return response;
    }
}
