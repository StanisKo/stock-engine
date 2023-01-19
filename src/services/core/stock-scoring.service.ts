import { resolve } from 'path';

import Piscina from 'piscina';

import { AnyBulkWriteOperation } from 'mongodb';

import { IStockProfile } from '../../interfaces/stock-profile.interface';

import { ServiceResponse } from '../../dtos/serviceResponse';

import { Industry } from '../../schemas/industry.schema';

export class StockScoringService {

    public async scoreStocks(): Promise<ServiceResponse> {

        const response = new ServiceResponse();

        try {

            /*
            We need to process all of them
            */

            /*
            NOTE: DEV & DEBUG

            const industries = await Industry.find({}, { name: true }).lean();
            */
            const industries = await Industry.find({ name: 'Airlines' }, { name: true }).lean();

            const workerPoolOptions = {
                filename: resolve(__dirname, '../workers/stock-scoring.worker.ts'),
                concurrentTasksPerWorker: 2
            };

            const workerPool = new Piscina(workerPoolOptions);

            let scoredProfiles = await Promise.all(
                industries.map(industry => workerPool.run(industry.name))
            );

            scoredProfiles = scoredProfiles.flat() as IStockProfile[];

            console.log(scoredProfiles);

            // const profilesInsertOperations: AnyBulkWriteOperation<IStockProfile>[] = [];

            /*
            TODO: db bulk updates here
            */
        }
        catch (error) {

            console.log(error);

            response.success = false;

            response.message = 'Failed to score profiled stocks';
        }

        return response;
    }
}
