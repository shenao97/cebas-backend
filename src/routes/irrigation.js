const express = require('express');
const router = express.Router();

const { default: mongoose } = require('mongoose');

const { POSTData, PUTData, DELETEData } = require('../utils/services/WebServices');

const Irrigation = require('../models/Irrigation');
const ParcelConfig = require('../models/ParcelConfig');
const { config } = require('dotenv');

const generateCalrep = (ini) => {
    const date = new Date(ini);
    let dayOfWeek = date.getUTCDay();
    dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const calrep = [false, false, false, false, false, false, false];
    calrep[dayOfWeek] = true;
    return calrep;
}

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
            ...irrigation, configId
        });
        const params = {
            "advanced": false,
            "calrep": generateCalrep(newIrrigation.startTime),
            "calrepToSend": null,
            "command": "66812ed7ddd2fd0b2291dd6e",
            "commandInfo": 0,
            "controller": {
                "_id": "5f1abe29f7d565578dd3e045",
                "serial": "IA0201E16000100052",
                "idNGSI": "IPex12:00052"
            },
            "description": "DSS Sector 2",
            "device": "5f1abe29f7d565578dd3e009",
            "enarep": 1,
            "end": null,
            "ini": newIrrigation.startTime,
            "nextExecution": newIrrigation.startTime,
            "numrep": -1,
            "numrepPending": -1,
            "programStatusNuevo": 1,
            "programStatusNuevoTimestamp": Date.now(),
            "programStatusTimestamp": "1970-01-01T00:00:00.000Z",
            "serial": "IA0201E16000100052",
            "time": newIrrigation.config.baseIrrigation*60, //Time in seconds
            "timerep": 86400,
            "utcoffset": 7200,
            "vol": 0
        }
        //const precimedData = await POSTData(`/controller/${process.env.CONTROLLER_ID}/device/${process.env.DEVICE_ID}/program`, params, { 'x-access-token': token })
        const precimedData = {status:200, data:{_id:'123'}}

        if (precimedData && precimedData.status === 200) {
            const precimedId = precimedData.data._id
            newIrrigation.precimedId = precimedId;
            console.log('New irrigation object with precimedId:', newIrrigation);
            await newIrrigation.save();
        }
        res.status(201).json({ status: 201, data: newIrrigation });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: 400, message: "Irrigation cannot be saved." });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    console.log(data)
    const token = req.headers['x-access-token'];
    console.log(id)
    if (!token) return res.status(401).json({ status: 401, message: 'Token is missing.' });
   
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ status: 400, message: "Invalid id" });
        if (!mongoose.Types.ObjectId.isValid(data.configId)) return res.status(400).json({ status: 400, message: "Invalid config id" });

        const existingConfig = await ParcelConfig.findById(data.configId);
        if (!existingConfig) {
            return res.status(404).json({ status: 404, message: "Config not found" });
        }

        const existingIrrigation = await Irrigation.findById(id);
        if (!existingIrrigation) {
            return res.status(404).json({ status: 404, message: "Irrigation not found" });
        }
        
        const params = {
            "advanced": false,
            "calrep": generateCalrep(data.irrigation.config.startTime),
            "calrepToSend": null,
            "description": "prueba put sector2",
            "device": "5f1abe29f7d565578dd3e009",
            "enarep": 1,
            "end": null,
            "idProgram": "66813381ddd2fd0b2291dd8d",
            "ini": data.irrigation.startTime,
            "numrep": -1,
            "numrepPending": -1,
            "time": data.irrigation.config.baseIrrigation*60,
            "timerep": 86400,
            "utcoffset": 7200,
            "vol": 0
        }
        console.log(data.irrigation.precimedId)
        //const precimedData = await PUTData(`/controller/${process.env.CONTROLLER_ID}/device/${process.env.DEVICE_ID}/program/${data.irrigation.precimedId}`, params, { 'x-access-token': token })
        const precimedData = {status:200}
        
        console.log('Received response from external API for update:', precimedData.status);
        if (precimedData && precimedData.status === 200) {
            console.log('holi')
            await Irrigation.findByIdAndUpdate(id, {
                ...data.irrigation
            }, { new: true });

            console.log('Updated irrigation object:', data);
            res.status(200).json({ status: 200, data: data });
        } else {
            res.status(400).json({ status: 400, message: "Error from external API" });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: 400, message: "Irrigation cannot be updated." });
    }    
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const precimedId = req.body
        const precimedData = {status:200}
        //const precimedData = await DELETEData(`/controller/${process.env.CONTROLLER_ID}/device/${process.env.DEVICE_ID}/program/${precimedId}/?deleteType=1`, params, { 'x-access-token': token })
        if (precimedData && precimedData.status === 200) {
            const deletedIrrigation = await Irrigation.findByIdAndDelete(id)
            if (!deletedIrrigation) return res.status(404).json({ status: 404, message: "There's not a irrigation available" });
            res.status(201).json({ status: 200, data: deletedIrrigation });
        }else{
            res.status(400).json({ status: 400, data: "Irrigation can't be deleted" });
        }
    } catch (error) {
        res.status(400).json({ status: 400, message: "Irrigation cannot be deleted." });
    }
});

module.exports = router;
