const CryptoJs = require('crypto-js');

const encryptPassword = (password) => {
  try{
    const hash = CryptoJs.SHA256(password);
    const codded = hash.toString(CryptoJs.enc.Base64);
    return codded
  }catch(err){
    throw err;
  }
}

module.exports = {
  encryptPassword
}