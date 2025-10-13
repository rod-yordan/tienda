const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Tienda API',
    description: 'Documentación generada automáticamente',
    version: '1.0.0',
  },
  servers: [
    { url: 'https://tienda-production-e8c8.up.railway.app' }
  ],
};

const outputFile = './openapi.json';  // Se crea automáticamente
const endpointsFiles = ['./index.js']; // Detecta todas las rutas usadas

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Documentación Swagger generada automáticamente.');
});

