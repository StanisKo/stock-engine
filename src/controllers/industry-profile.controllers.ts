import { Request, Response } from 'express';

import { IndustryProfileService } from '../services/industry-profile.service';

export const requestFinancialDataForIndustryProfile = async (
    request: Request, response: Response): Promise<Response> => {

    const { ticker } = request.query;

    if (!ticker) {
        response.statusCode = 404;

        response.status(404).json(
            {
                message: 'ticker querystring parameter is required'
            }
        );
    }

    const industryProfileService = new IndustryProfileService(ticker as string);

    const serviceResponse = await industryProfileService.requestFinancialData();

    return response.status(200).json(serviceResponse);
};
