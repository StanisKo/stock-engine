import { Request, Response } from 'express';

import { StockScoringService } from '../services/core/stock-scoring.service';

export const scoreStocks = async (request: Request, response: Response): Promise<Response> => {

    const stockProfilingService = new StockScoringService();

    const serviceResponse = await stockProfilingService.scoreStocks();

    return response.status(200).json(serviceResponse);
};
