/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

const fetch = require('node-fetch');

(async () => {
    const requst = await fetch('https://eodhistoricaldata.com/api/fundamentals/AAPL.US?api_token=demo');

    const res = await requst.json();

    console.log(
        res.Financials.Balance_Sheet.yearly[
            Object.keys(res.Financials.Balance_Sheet.yearly)[0]
        ]
    );
})();
