import http from 'http';
import express, { Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import demoRouter from './routes/demo.routes';

class Server {

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

        this.application.use('', demoRouter);
    }

    private async establishDatabaseConnection(): Promise<void> {

        const { MONGO_PROTOCOL, MONGO_USERNAME, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_DATABASE } = process.env;

        console.log(`${MONGO_PROTOCOL}://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`);

        await mongoose.connect(
            `${MONGO_PROTOCOL}://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`
        );
    }

    public async run(): Promise<void> {

        await this.establishDatabaseConnection();

        this.connectRoutes();

        const server = http.createServer(this.application);

        server.listen(this.port).on('listening', async () => {

            console.log( `Engine is available on ${server.address()}:${this.port}`);

        }).on('error', error => {

            console.log(error.message);

            console.log(error.stack);
        });
    }
}

(async (): Promise<void> => {
    const server = new Server();

    await server.run();
})();
