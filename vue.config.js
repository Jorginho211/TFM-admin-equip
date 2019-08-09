const fs = require('fs');

module.exports = {
  devServer: {
    http2: true,
    https: {
        key: fs.readFileSync('./certs/equip.key'),
        cert: fs.readFileSync('./certs/equip.crt'),
        ca: fs.readFileSync('./certs/ca.crt'),
      }
  }
};