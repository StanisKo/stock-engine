import dotenv from 'dotenv';

import fetch from 'node-fetch';

dotenv.config();

(async (): Promise<void> => {
    /*
    We first drill down through the fundamentals API:

    Their infra is not guaranteed to be warm enough to provide all the data at once

    In such, we exhaust their endpoints until engine's controller responds with success
    */
    let shouldContinueIngesting = true;

    while (shouldContinueIngesting) {

        console.log('Ingesting now');

        const request = await fetch(`${process.env.HOST}:${process.env.PORT}/ingest-stocks`);

        const { success } = await request.json();

        if (success) {

            shouldContinueIngesting = !success;
        }
        else {

            console.log('Ingest failed, retrying now');

            continue;
        }
    }

    console.log('Ingest successful');

    /*
    We then proceed to profiling
    */
    console.log('Profiling now');

    await fetch(`${process.env.HOST}:${process.env.PORT}/profile-stocks`);

    console.log('Profiling successful');

    /*
    Finally, we tap into scoring
    */
    console.log('Scoring now');

    await fetch(`${process.env.HOST}:${process.env.PORT}/score-stocks`);

    console.log('Scoring successful');
})();
