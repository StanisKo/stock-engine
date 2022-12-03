import { Request, Response } from 'express';

import { IndustryProfileService } from '../services/industry-profile.service';

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

    const industryProfileService = new IndustryProfileService(ticker as string);

    const serviceResponse = await industryProfileService.createIndustryProfileFromTicker();

    return response.status(200).json(serviceResponse);
};
