import { Request, Response } from 'express';

import { StockProfileService } from '../services/core/stock-profile.service';

export const createStockProfile = async (
    request: Request, response: Response): Promise<Response> => {

    const { ticker } = request.query;

    if (!ticker) {
        response.status(404).json(
            {
                message: 'ticker querystring parameter is required'
            }
        );
    }

    const stockProfileService = new StockProfileService(ticker as string);

    const serviceResponse = await stockProfileService.createStockProfile();

    return response.status(200).json(serviceResponse);
};
