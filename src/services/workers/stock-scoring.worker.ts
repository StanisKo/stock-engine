import { IStockProfile } from '../../interfaces/stock-profile.interface';

import { StockProfile } from '../../schemas/stock-profile.schema';

import { WeightConfiguratorService } from '../core/weight-configurator.service';

import { RatiosExtractorService } from '../helpers/ratios-extractor.service';

import { RatiosProcessorService } from '../processors/ratios-processor.service';

/*
TODO: class that gathers input before passing them into processors: on all rations

and then merge sort all those inputs

do not loop through categories, only ratios in extractir

*/


export default async (industry: string): Promise<IStockProfile[]> => {

    const weightConfiguratorService = new WeightConfiguratorService();

    const ratiosExtractorService = new RatiosExtractorService;

    const profilesToScore = await StockProfile.find({ industry }).lean();

    const scoredProfiles: IStockProfile[] = [];

    RatiosProcessorService.ratiosExtractorService = ratiosExtractorService;

    RatiosProcessorService.weightConfiguratorService = weightConfiguratorService;

    for (let i = 0; i < profilesToScore.length; i++) {

        const profile = profilesToScore[i];

        let overallProfileScore = 0;

        RatiosProcessorService.processRatio();
    }

    return scoredProfiles;
};
