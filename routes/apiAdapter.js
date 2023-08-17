const axios = require('axios');
const { TIMEOUT } = process.env;

module.exports = (baseURL) => 
    axios.create({
        baseURL,
        timeout: TIMEOUT,
        // parse integer digunakan untuk ubah pemanggilan angka dari .env agar tidak berupa string dan tetap sebagai integer / dari "5000" => 5000
    });
