import { IStockProfile } from '../../interfaces/stock-profile.interface';

class StockProfilingWorker {

    public async process(): Promise<IStockProfile> {


    }

}

export const profile = async (): Promise<IStockProfile[]> => {

    const stockProfilingWorker = new StockProfilingWorker();

    
}


