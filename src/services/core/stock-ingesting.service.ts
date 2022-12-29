import { AnyBulkWriteOperation } from 'mongodb';

import { IIndustry } from '../../interfaces/industry.interface';
import { Industry } from '../../schemas/industry.schema';

import { ServiceResponse } from '../../dtos/serviceResponse';

import { ApiConnectorService } from './api-connector.service';

export class StockIngestingService {

    apiConnectorService: ApiConnectorService;

    constructor() {

        this.apiConnectorService = new ApiConnectorService();
    }

    public async ingestStocks(): Promise<ServiceResponse> {

        const response = new ServiceResponse();

        try {

            const bulkFundamentalsData = await this.apiConnectorService.requestBulkFundamentalsData();

            /*
            At this point we need to deduce unique industries across received data points
            and persist them for further operations
            */
            const industries: string[] = [];

            let insertOperations: AnyBulkWriteOperation<IIndustry>[] = [];

            for (let i = 0; i < bulkFundamentalsData.length; i++) {

                const industry = bulkFundamentalsData[i].General.Industry;

                if (industries.includes(industry)) {

                    continue;
                }

                industries.push(industry);

                insertOperations = [
                    ...insertOperations,
                    {
                        insertOne: { document: new Industry({ name: industry }) }
                    }
                ];
            }

            await Industry.bulkWrite(insertOperations);

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
