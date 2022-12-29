import { AnyBulkWriteOperation } from 'mongodb';

import { IIndustry } from '../../interfaces/industry.interface';
import { Industry } from '../../schemas/industry.schema';

import { IFundamentals } from '../../interfaces/fundamentals.interface';
import { Fundamentals } from '../../schemas/fundamentals.schema';

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
            const industries: { [key: string]: boolean } = {};

            let industriesInsertOperations: AnyBulkWriteOperation<IIndustry>[] = [];

            for (let i = 0; i < bulkFundamentalsData.length; i++) {

                const industry = bulkFundamentalsData[i].General.Industry;

                /*
                Besides the uniqueness check, weed out garbage data
                */
                if (!industry || industries[industry]) {

                    continue;
                }

                industries[industry] = true;

                industriesInsertOperations = [
                    ...industriesInsertOperations,
                    {
                        insertOne: { document: new Industry({ name: industry }) }
                    }
                ];
            }

            await Industry.bulkWrite(industriesInsertOperations);

            /*
            Further, we need to store all of the requested fundamentals

            TODO: do not ingest garbage: if no industry amongst ingested industries, skip
            */
            
            let fundamentalsInsertOperations: AnyBulkWriteOperation<IFundamentals>[] = [];

            for (let i = 0; i < bulkFundamentalsData.length; i++) {

                fundamentalsInsertOperations = [
                    ...fundamentalsInsertOperations,
                    {
                        insertOne: { document: new Fundamentals({ data: { ...bulkFundamentalsData[i] } }) }
                    }
                ];
            }

            await Fundamentals.bulkWrite(fundamentalsInsertOperations);

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
