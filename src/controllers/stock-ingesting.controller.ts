import { Request, Response } from 'express';

import { StockIngestingService } from '../services/core/stock-ingesting.service';

export const ingestStocks = async (request: Request, response: Response): Promise<Response> => {

    const stockIngestingService = new StockIngestingService();

    const serviceResponse = await stockIngestingService.ingestStocks();

    return response.status(200).json(serviceResponse);
};
