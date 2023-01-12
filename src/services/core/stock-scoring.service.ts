import { ServiceResponse } from '../../dtos/serviceResponse';

export class StockScoringService {

    public async scoreStocks(): Promise<ServiceResponse> {

        const response = new ServiceResponse();

        try {


        }
        catch (error) {

            console.log(error);

            response.success = false;

            response.message = 'Failed to score profiled stocks';
        }

        return response;
    }
}
