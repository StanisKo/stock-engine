import http from 'http';
import express, { Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import stockProfilingRouter from './routes/stock-profiling.routes';
import stockIngestingRouter from './routes/stock-ingesting.routes';

import { ApiConnectorService } from './services/core/api-connector.service';

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

        this.application.use('', stockProfilingRouter, stockIngestingRouter);
    }

    private async establishDatabaseConnection(): Promise<void> {

        const { MONGO_PROTOCOL, MONGO_USERNAME, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_DATABASE } = process.env;

        await mongoose.connect(
            `${MONGO_PROTOCOL}://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`
        );
    }

    public async run(): Promise<void> {

        await this.establishDatabaseConnection();

        this.connectRoutes();

        const server = http.createServer(this.application);

        server.listen(this.port).on('listening', async () => {

            ApiConnectorService.initializeSharedFields();

            console.log( `Engine is available on port ${this.port}`);

        }).on('error', error => {

            console.log(error.message);

            console.log(error.stack);
        });
    }
}
