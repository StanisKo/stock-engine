import { Request, Response } from 'express';

import { IndustryProfile } from '../schemas/industry-profile.schema';

const demo = async (request: Request, response: Response): Promise<void> => {

    const industryProfile = new IndustryProfile();

    await industryProfile.save();

    response.status(200).json(
        {
            data: industryProfile
        }
    );
};

export default { demo };
