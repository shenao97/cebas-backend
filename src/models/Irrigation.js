const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IrrigationSchema = new Schema({
    parcelName: String,
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
    },
    startTime: String,
    endTime: String,
    isPending: Boolean,
    configId:String,
    precimedId: String
});

module.exports = mongoose.model('Irrigation', IrrigationSchema);
