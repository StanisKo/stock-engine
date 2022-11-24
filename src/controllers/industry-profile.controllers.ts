import { Request, Response } from 'express';

import { IndustryProfile } from '../schemas/industry-profile.schema';

export const fetchFinancialDataForIndustryProfile = async (request: Request, response: Response): Promise<Response> => {

    const { ticker } = request.query;

    if (!ticker) {
        response.statusCode = 400;
        response.statusMessage = 'ticker querystring parameter is required';

        return response;
    }

    const industryProfile = new IndustryProfile();

    await industryProfile.save();

    response.statusCode = 200;

    response.json(
        {
            data: industryProfile
        }
    );

    return response;
};
