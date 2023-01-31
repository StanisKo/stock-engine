import dotenv from 'dotenv';

import fetch from 'node-fetch';

import { Logger } from './utils/logger';

dotenv.config();

(async (): Promise<void> => {
    /*
    We first drill down through the fundamentals API:

    Their infra is not guaranteed to be warm enough to provide all the data at once

    In such, we exhaust their endpoints until engine's controller responds with success
    */
    let shouldContinueIngesting = true;

    while (shouldContinueIngesting) {

        Logger.info('Ingesting now');

        const request = await fetch(`${process.env.HOST}:${process.env.PORT}/ingest-stocks`);

        const { success } = await request.json();

        if (success) {

            shouldContinueIngesting = !success;
        }
        else {

            Logger.info('Ingest failed, retrying now');

            continue;
        }
    }

    Logger.info('Ingest successful');

    /*
    We then proceed to profiling
    */
    Logger.info('Profiling now');

    await fetch(`${process.env.HOST}:${process.env.PORT}/profile-stocks`);

    Logger.info('Profiling successful');

    /*
    Finally, we tap into scoring
    */
    Logger.info('Scoring now');

    await fetch(`${process.env.HOST}:${process.env.PORT}/score-stocks`);

    Logger.info('Scoring successful');
})();
