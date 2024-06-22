const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IrrigationSchema = new Schema({
    parcelName: String,
    config: {
        type: Schema.Types.ObjectId,
        ref: 'ParcelConfig'
    },
    startTime: String,
    endTime: String,
    isPending: Boolean
});

module.exports = mongoose.model('Irrigation', IrrigationSchema);
