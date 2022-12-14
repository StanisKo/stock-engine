import { Request, Response } from 'express';

import { StockProfileService } from '../services/core/stock-profile.service';

export const createIndustryProfileFromTicker = async (
    request: Request, response: Response): Promise<Response> => {

    const { ticker } = request.query;

    if (!ticker) {
        response.status(404).json(
            {
                message: 'ticker querystring parameter is required'
            }
        );
    }

    const industryProfileService = new StockProfileService(ticker as string);

    const serviceResponse = await industryProfileService.createStockProfile();

    return response.status(200).json(serviceResponse);
};
