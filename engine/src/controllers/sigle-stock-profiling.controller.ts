import { Request, Response } from 'express';

import { SingleStockProfilingService } from '../services/misc/single-stock-profiling.service';

export const profileStock = async (request: Request, response: Response): Promise<Response> => {

    const { ticker } = request.query;

    if (!ticker) {

        return response.status(400).json({ message: 'ticker querystring parameter is required' });
    }

    const singleStockProfilingService = new SingleStockProfilingService();

    const serviceResponse = await singleStockProfilingService.profileStock(ticker as string);

    return response.status(200).json(serviceResponse);
};
