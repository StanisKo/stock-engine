import * as uuid from 'uuid';

import mongoose from 'mongoose';

import { IIndustry } from '../interfaces/industry.interface';

const industrySchema = new mongoose.Schema<IIndustry>(
    {
        _id: { type: String, default: uuid.v4 },

        name: { type: String, required: true, unique: true }
    },

    { collection: 'Industries', timestamps: true }
);

export const Industry = mongoose.model('Industry', industrySchema);
