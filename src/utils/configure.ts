import { StockParserService } from '../services/parsers/stock-parser.service';

import { GeneralParserService } from '../services/parsers/general-parser.service';

import { extendMultiple } from './extend-multiple.mixin';

export const configure = (): void => {

    extendMultiple(StockParserService, [GeneralParserService]);
};
