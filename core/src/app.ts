import express, { Application } from 'express';

import demoRouter from './routes/demo.routes';

require('dotenv').config();

const application: Application = express();

const port: number = Number(process.env.PORT) ?? 8000;

application.use(
    express.json()
);

application.use(
    express.urlencoded({ extended: true })
);

application.use('', demoRouter);

application.listen(port, (): void => {

    return console.log(`API is avaialable on port ${port}`);
});