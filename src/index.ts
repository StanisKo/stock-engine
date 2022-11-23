import { Server } from './server';

(async (): Promise<void> => {
    const server = new Server();

    await server.run();
})();
