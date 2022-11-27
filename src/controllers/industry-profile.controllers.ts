import { Request, Response } from 'express';

import { IndustryProfileMaker } from '../services/industry-profile-maker';

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

    const industryProfileMaker = new IndustryProfileMaker(ticker as string);

    const serviceResponse = await industryProfileMaker.createIndustryProfileFromTicker();

    return response.status(200).json(serviceResponse);
};
