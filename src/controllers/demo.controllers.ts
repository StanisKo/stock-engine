import { Request, Response } from 'express';

import { StockProfile } from '../schemas/stock-profile.schema';

const demo = async (request: Request, response: Response): Promise<void> => {

    const stockProfile = new StockProfile();

    await stockProfile.save();

    response.status(200).json(
        {
            data: stockProfile
        }
    );
};

export default { demo };
