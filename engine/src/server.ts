/* eslint-disable @typescript-eslint/no-non-null-assertion */

import http from 'http';
import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { establishDatabaseConnection } from './utils/database.connector';

import stockProfilingRouter from './routes/stock-profiling.routes';
import stockIngestingRouter from './routes/stock-ingesting.routes';
import stockScoringRouter from './routes/stock-scoring.routes';

import singleProfilingRouter from './routes/single-stock-profiling.routes';

import { ApiConnectorService } from './services/core/api-connector.service';

import { Logger } from './utils/logger';

export class Server {

    application: Application;

    port: number;

    constructor() {

        dotenv.config();

        this.application = express();

        this.port = Number(process.env.PORT);

        this.application.use(express.json());

        this.application.use(express.urlencoded({ extended: true }));

        this.application.enable('trust proxy');

        this.application.disable('x-powered-by');

        this.application.use(
            cors({
                exposedHeaders: 'Authorization'
            })
        );
    }

    private connectRoutes(): void {

        this.application.use('', stockProfilingRouter, stockIngestingRouter, stockScoringRouter);

        if (['local'].includes(process.env.ENV!)) {

            this.application.use('', singleProfilingRouter);
        }
    }

    public async run(): Promise<void> {

        await establishDatabaseConnection();

        this.connectRoutes();

        const server = http.createServer(this.application);

        server.listen(this.port).on('listening', async () => {

            ApiConnectorService.initializeSharedFields();

            Logger.info( `Engine is available on port ${this.port}`);

        }).on('error', error => {

            Logger.error(error.message);

            Logger.error(error.stack);
        });
    }
}
