import { Request, Response } from 'express';

import { IndustryProfileService } from '../services/industry-profile.service';

export const requestFinancialDataForIndustryProfile = async (request: Request, response: Response): Promise<void> => {

    const { ticker } = request.query;

    if (!ticker) {
        response.statusCode = 400;
        response.statusMessage = 'ticker querystring parameter is required';

        response.send();
    }

    const industryProfileService = new IndustryProfileService(ticker as string);

    try {
        await industryProfileService.requestFinancialData();
    }
    catch (error) {
        response.statusCode = 500;
        response.statusMessage = (error as Error).message;

        response.send();
    }

    response.statusCode = 200;

    response.json(
        {
            success: true
        }
    );
};
