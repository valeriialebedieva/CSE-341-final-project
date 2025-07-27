const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'CSEMart',
        description: ''
    },
    host: 'localhost:3000',
    schemes: ['https', 'http']
};

const outputFile = './swagger.json';
const endpointFiles = ['./routers/index.js'];

swaggerAutogen(outputFile, endpointFiles, doc);