import { Request, Response } from 'express';

import { StockProfilingService } from '../services/core/stock-profiling.service';

export const profileStocks = async (request: Request, response: Response): Promise<Response> => {

    const stockProfilingService = new StockProfilingService();

    const serviceResponse = await stockProfilingService.profileStocks();

    return response.status(200).json(serviceResponse);
};
