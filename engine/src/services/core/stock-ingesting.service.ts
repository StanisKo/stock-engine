import moment from 'moment';

import { AnyBulkWriteOperation } from 'mongodb';

import { IIndustry } from '../../interfaces/industry.interface';
import { Industry } from '../../schemas/industry.schema';

import { IFundamentals } from '../../interfaces/fundamentals.interface';
import { Fundamentals } from '../../schemas/fundamentals.schema';

import { ServiceResponse } from '../../dtos/serviceResponse';

import { ApiConnectorService } from './api-connector.service';

import { TimeSeriesHelperService } from '../helpers/time-series-helper.service';

import { Logger } from '../../utils/logger';

export class StockIngestingService {

    public async ingestStocks(): Promise<ServiceResponse> {

        const response = new ServiceResponse();

        try {

            const bulkFundamentalsData = await ApiConnectorService.requestBulkFundamentalsData();

            /*
            At this point we need to deduce unique industries across received data points
            and persist them for further operations
            */
            const industries: { [key: string]: boolean } = {};

            let industriesUpsertOperations: AnyBulkWriteOperation<IIndustry>[] = [];

            for (let i = 0; i < bulkFundamentalsData.length; i++) {

                const industry = bulkFundamentalsData[i].General.Industry;

                /*
                Check if industry is provided, check if industry is not a shell company,
                finally, check uniqueness
                */
                if (!industry || industry === 'Shell Companies' || industries[industry]) {

                    continue;
                }

                industries[industry] = true;

                industriesUpsertOperations = [
                    ...industriesUpsertOperations,
                    {
                        updateOne: {
                            filter: { name: industry },

                            update: { $set: { name: industry } },

                            upsert: true
                        }
                    }
                ];
            }

            await Industry.bulkWrite(industriesUpsertOperations);

            /*
            Further, we need to store all of the requested fundamentals
            */

            let fundamentalsUpsertOperations: AnyBulkWriteOperation<IFundamentals>[] = [];

            for (let i = 0; i < bulkFundamentalsData.length; i++) {

                /*
                If ticker is delisted, weed it out -- garbage data
                */
                if (bulkFundamentalsData[i].General.IsDelisted) {

                    continue;
                }

                /*
                If ticker does not meet our industry criteria, weed it out
                */
                if (!industries[bulkFundamentalsData[i].General.Industry]) {

                    continue;
                }

                /*
                If ticker does not have IPO date, or it is set for the future, weed it out
                */
                const tickerIPODate = moment(bulkFundamentalsData[i].General.IPODate);

                if (!tickerIPODate.isValid() || tickerIPODate.isAfter(moment())) {

                    continue;
                }

                /*
                If ticker IPO date is after TTM margin, stock is too young to be evaluated properly, weed it out
                */
                const [ttmMarginStart] = TimeSeriesHelperService.getTTMMargin();

                const tickerIPODateIsAfterTTMMargin = tickerIPODate.isAfter(moment(ttmMarginStart, 'MM-DD-YYYY'));

                if (tickerIPODateIsAfterTTMMargin) {

                    continue;
                }

                fundamentalsUpsertOperations = [
                    ...fundamentalsUpsertOperations,
                    {
                        updateOne: {
                            filter: { ticker: bulkFundamentalsData[i].General.Code },

                            update: { $set: { data: { ...bulkFundamentalsData[i] } } },

                            upsert: true
                        }
                    }
                ];
            }

            await Fundamentals.bulkWrite(fundamentalsUpsertOperations);

            response.success = true;
        }
        catch (error) {

            Logger.error(error);

            response.success = false;

            response.message = 'Failed to ingest fundamentals';
        }

        return response;
    }
}
