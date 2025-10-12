const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Tienda API',
    description: 'Documentación generada automáticamente',
    version: '1.0.0',
  },
  servers: [
    { url: 'http://localhost:3000' },
    { url: 'https://tienda-production-e8c8.up.railway.app' }
  ],
};

const outputFile = './openapi.json';
const endpointsFiles = ['./index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Documentación Swagger generada automáticamente.');
});
