import * as uuid from 'uuid';

import mongoose from 'mongoose';

const fundamentalsSchema = new mongoose.Schema(
    {
        _id: { type: String, default: uuid.v4 },

        /*
        We save data as an arbitrary JavaScript object to avoid typing
        out a rather beefy API response
        */
        data: { type: Object, required: true }
    },

    { collection: 'Fundamentals', timestamps: true }
);

export const Fundamentals = mongoose.model('Fundamentals', fundamentalsSchema);
