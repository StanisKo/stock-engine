// import { Industry } from '../../schemas/industry.schema';

// import { Fundamentals } from '../../schemas/fundamentals.schema';

import { ServiceResponse } from '../../dtos/serviceResponse';

import { ApiConnectorService } from './api-connector.service';

import { StockParsingService } from './stock-parsing.service';

export class StockProfilingService {

    public async profileStocks(): Promise<ServiceResponse> {

        const response = new ServiceResponse();

        try {

            /*
            TODO: worker, adapt api connector, rename parser, glue things together,
            rework parser

            Request benchmark prices, treasury bondy yield
            */
            const benchmarkPrices = await ApiConnectorService.requestBenchmarkPrices();

            const treasuryBondYield = await ApiConnectorService.requestUSTreasuryBondYield();

            StockParsingService._inititializeStatic(benchmarkPrices, treasuryBondYield);

            /*
            https://deepsource.io/blog/nodejs-worker-threads/

            https://blog.logrocket.com/node-js-multithreading-worker-threads-why-they-matter/

            On worker pools!:
            https://www.npmjs.com/package/piscina
            */

            /*
            tickers = query()

            batches = chunk(tickers)

            pool = new Piscina()

            options = { filename: resolve(__dirname, '../workers/stock-profiling.worker.ts') }

            result = await Promise.all(batches.map(batch => pool.run(batch, options)))

            result = result.flatMap()
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
