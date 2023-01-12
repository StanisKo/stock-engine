import { ServiceResponse } from '../../dtos/serviceResponse';

import { Industry } from '../../schemas/industry.schema';

export class StockScoringService {

    public async scoreStocks(): Promise<ServiceResponse> {

        const response = new ServiceResponse();

        try {

            /*
            We need to process all of them
            */
            const industries = await Industry.find({}).lean();

        }
        catch (error) {

            console.log(error);

            response.success = false;

            response.message = 'Failed to score profiled stocks';
        }

        return response;
    }
}
