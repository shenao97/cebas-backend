const express = require('express');
const router = express.Router();

const { default: mongoose } = require('mongoose');

const { POSTData, PUTData, DELETEData } = require('../utils/services/WebServices');

const Irrigation = require('../models/Irrigation');
const ParcelConfig = require('../models/ParcelConfig');

router.get('/', async (req, res) => {
    try {
        const irrigations = await Irrigation.find().populate('config');
        if (!irrigations) return res.status(400).json({ status: 404, message: "There're not an available irrigations" });
        return res.status(200).json({ status: 200, data: irrigations });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: 404, message: "There're not an available irrigations" });
    }
});

router.post('/', async (req, res) => {
    const token = req.headers['x-access-token'];
    const { irrigation, configId } = req.body;
    if (!token) return res.status(401).json({ status: 401, message: 'Token is missing.' })
    try {
        if (!mongoose.Types.ObjectId.isValid(configId)) {
            return res.status(400).json({ status: 400, message: "Invalid config id" });
        }
        const existingConfig = await ParcelConfig.findById(configId);
        if (!existingConfig) {
            return res.status(404).json({ status: 404, message: "Config not found" });
        }
        const newIrrigation = new Irrigation({
            ...irrigation
        });
        await newIrrigation.save();
        const params = {
            description: "prueba",
            device: "655ccff467f84a9bc59e3dc6",
            ini: "2024-06-05T22:00:00.000Z",
            end: null,
            time: 3600,
            vol: 10,
            enarep: 1,
            timerep: 86400,
            numrep: -1,
            calrep: [
                true,
                true,
                true,
                true,
                true,
                true,
                true
            ],
            calrepToSend: [
                true,
                true,
                true,
                true,
                true,
                true,
                true
            ],
            numrepPending: -1,
            utcoffset: 0,
            advanced: 0,
            alerta: false,
            percent: 100
        }
        //await POSTData(`/controller/${process.env.CONTROLLER_ID}/device/${process.env.DEVICE_ID}/program`, params, { 'x-access-token': token })
        res.status(201).json({ status: 201, data: newIrrigation });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: 400, message: "Irrigation cannot be saved." });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { irrigation, configId } = req.body;

        const token = req.headers['x-access-token'];
        if (!token) return res.status(401).json({ status: 401, message: 'Token is missing.' })

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ status: 400, message: "Invalid id" });

        const updatedIrrigation = await Irrigation.findByIdAndUpdate(id, {
            ...irrigation,
            config: configId
        });

        if (!updatedIrrigation) return res.status(404).json({ status: 404, message: "Irrigation not found" });

        const params = {
            description: "prueba",
            device: "655ccff467f84a9bc59e3dc6",
            ini: "2024-06-05T22:00:00.000Z",
            end: null,
            time: 3600,
            vol: 10,
            enarep: 1,
            timerep: 86400,
            numrep: -1,
            calrep: [
                true,
                true,
                true,
                true,
                true,
                true,
                true
            ],
            calrepToSend: [
                true,
                true,
                true,
                true,
                true,
                true,
                true
            ],
            numrepPending: -1,
            utcoffset: 0,
            advanced: 0,
            alerta: false,
            percent: 100
        }
        //await PUTData(`/controller/${process.env.CONTROLLER_ID}/device/${process.env.DEVICE_ID}/program/:idProgram`, params, { 'x-access-token': token })

        res.status(200).json({ status: 200, data: updatedIrrigation });
    } catch (error) {
        res.status(400).json({ status: 404, message: "Parcel configuration cannot be saved." });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedIrrigation = await Irrigation.findByIdAndDelete(id)
        if (!deletedIrrigation) return res.status(404).json({ status: 404, message: "There's not a irrigation available" });
        
        //await DELETEData(`/controller/${process.env.CONTROLLER_ID}/device/${process.env.DEVICE_ID}/program/:idProgram`, params, { 'x-access-token': token })
        res.status(201).json({ status: 200, data: deletedIrrigation });
    } catch (error) {
        res.status(400).json({ status: 400, message: "Irrigation cannot be deleted." });
    }
});

router.delete('/', async (req, res) => {
    try {
        const deletedIrrigation = await Irrigation.collection('inventory').deleteMany({});
        //const parcelConfig = await ParcelConfig.collection('inventory').deleteMany({});
        //await DELETEData(`/controller/${process.env.CONTROLLER_ID}/device/${process.env.DEVICE_ID}/program/:idProgram`, params, { 'x-access-token': token })
        res.status(201).json({ status: 200, data: {deletedIrrigation, parcelConfig} });
    } catch (error) {
        res.status(400).json({ status: 400, message: "Irrigation cannot be deleted." });
    }
});

module.exports = router;
