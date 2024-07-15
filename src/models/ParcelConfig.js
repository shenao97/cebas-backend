const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParcelConfigSchema = new Schema({
    
    parcelName: String,
    configFilled: Boolean,
    config:{
        rootsL: Number,
        drainL: Number,
        aRootsTimelapse: Number,
        aDrainTimelapse: Number,
        percentageIncrement: Number,
        rootsLThreshold: Number,
        drainLThreshold: Number,
        baseIrrigation: Number,
        minIrrigationTimeMin: Number,
        maxIrrigationTimeMin: Number,
        startTime1: String,
        startTime2: String,
        startTime3: String,
        initialDate: String
    }

});

module.exports = mongoose.model('ParcelConfig', ParcelConfigSchema);
