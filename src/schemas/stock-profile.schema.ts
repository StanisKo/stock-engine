import * as uuid from 'uuid';

import mongoose from 'mongoose';

const { Schema } = mongoose;

const stockProfileSchema = new Schema(
    {
        _id: { type: mongoose.SchemaTypes.String, default: uuid.v4 }
    },

    { collection: 'StockProfiles', timestamps: true }
);

export const StockProfile = mongoose.model('StockProfile', stockProfileSchema);
