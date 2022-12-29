import * as uuid from 'uuid';

import mongoose from 'mongoose';

const industrySchema = new mongoose.Schema(
    {
        _id: { type: String, default: uuid.v4 },

        name: { type: String, required: true }
    },

    { collection: 'Industries', timestamps: true }
);

export const Industry = mongoose.model('Industry', industrySchema);
