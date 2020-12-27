/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

require('ts-node').register({
  compilerOptions: {
    module: 'CommonJS',
  },
});

const { bundle } = require(path.join(process.cwd(), 'rollup', 'builder'));

module.exports = bundle();
