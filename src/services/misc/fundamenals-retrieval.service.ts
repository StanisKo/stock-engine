import { ITickerFundamentals } from '../../interfaces/ticker.interface';

import { ApiConnectorService } from '../core/api-connector.service';

export class FundamentalsRetrievalService {

    public async retrieveFundamentals(ticker: string): Promise<ITickerFundamentals> {

        let fundamentals: ITickerFundamentals;

        try {

            fundamentals = await ApiConnectorService.requestTickerFundamentals(ticker);
        }
        catch (_) {

            const error = new Error();

            error.message = 'No fundamentals available for provided ticker';

            throw error;
        }

        return fundamentals;
    }
}