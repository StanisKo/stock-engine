import { resolve } from 'path';

import Piscina from 'piscina';

import { IStockProfile } from '../../interfaces/stock-profile.interface';

import { Fundamentals } from '../../schemas/fundamentals.schema';

import { StockProfile } from '../../schemas/stock-profile.schema';

import { ServiceResponse } from '../../dtos/serviceResponse';

import { ApiConnectorService } from './api-connector.service';

import { StockParsingService } from './stock-parsing.service';

/*
Temp:

https://deepsource.io/blog/nodejs-worker-threads/

https://blog.logrocket.com/node-js-multithreading-worker-threads-why-they-matter/

On worker pools!:
https://www.npmjs.com/package/piscina
*/

export class StockProfilingService {

    public async profileStocks(): Promise<ServiceResponse> {

        const response = new ServiceResponse();

        try {

            const benchmarkPrices = await ApiConnectorService.requestBenchmarkPrices();

            const treasuryBondYield = await ApiConnectorService.requestUSTreasuryBondYield();

            StockParsingService._inititializeStatic(benchmarkPrices, treasuryBondYield);

            /*
            We need to process all of them anyways
            */
            const fundamentals = await Fundamentals.find({});

            /*
            We batch by 500 sets
            */
            const batches = [];

            const batchSize = 500;

            for (let i = 0; i < fundamentals.length; i += batchSize) {

                batches.push(
                    fundamentals.slice(i, i + batchSize)
                );
            }

            const workerPoolOptions = { filename: resolve(__dirname, '../workers/stock-profiling.worker.ts') };

            const workerPool = new Piscina();

            /*
            For every batch, start its own separate process (worker) to profile through bathces
            in parallel
            */
            let stockProfiles = await Promise.all(
                batches.map(batch => workerPool.run(batch, workerPoolOptions))
            );

            stockProfiles = stockProfiles.flat() as IStockProfile[];

            /*
            At this point we need to persist created stock profiles

            As of now, we're using database validation layer as our discard mechanism:

            We persist created profiles one-by-one in a try-catch and skip over a fail
            (if profile contains N/A values)
            */

            for (let i = 0; i < stockProfiles.length; i++) {

                try {

                    await StockProfile.create(stockProfiles[i]);
                }
                catch (error) {

                    console.log(`Discarding ${stockProfiles[i].ticker}`);

                    continue;
                }
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
