/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

const fetch = require('node-fetch');

(async () => {
    const requst = await fetch('https://eodhistoricaldata.com/api/fundamentals/AAPL.US?api_token=demo');

    const res = await requst.json();

    /*
    Do whatever you need to do here
    */
    console.log(
        res.Financials.Income_Statement.yearly[
            Object.keys(res.Financials.Income_Statement.yearly)[0]
        ]
    );
})();
