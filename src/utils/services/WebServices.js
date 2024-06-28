const axios = require('axios');

const CURRENT_API_URL = process.env.API_URL;
const COMMON_HEADERS = { 'Content-Type': 'application/json' }

const POSTData = async (endpoint, params = {}, customHeaders) => {
  try {
    const response = await axios.post(`${CURRENT_API_URL}${endpoint}`, params, {
      headers: customHeaders ? { ...customHeaders, ...COMMON_HEADERS } : COMMON_HEADERS
    })
    if(!response) throw new Error('Bad response!')
    return response
  } catch (err) {
    console.log(err);
    throw err;
  }
}

const PUTData = async (endpoint, params = {}, customHeaders) => {
  try {
    const response = await axios.put(`${CURRENT_API_URL}${endpoint}`, params, {
      headers: customHeaders ? { ...customHeaders, ...COMMON_HEADERS } : COMMON_HEADERS
    })
    if(!response) throw new Error('Bad response!')
    return response
  } catch (err) {
    console.log(err);
    throw err;
  }
}

const DELETEData = async (endpoint, params = {}, customHeaders) => {
  try {
    const response = await axios.delete(`${CURRENT_API_URL}${endpoint}`, params, {
      headers: customHeaders ? { ...customHeaders, ...COMMON_HEADERS } : COMMON_HEADERS
    })
    if(!response) throw new Error('Bad response!')
    return response
  } catch (err) {
    console.log(err);
    throw err;
  }
}


module.exports = {
  POSTData,
  PUTData,
  DELETEData
}