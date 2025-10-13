/*const swaggerAutogen = require('swagger-autogen')();

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
});*/

const swaggerAutogen = require('swagger-autogen')();
const fs = require('fs');

const doc = {
  info: {
    title: 'Tienda API',
    description: 'Documentación generada automáticamente',
    version: '1.0.0',
  },
  servers: [
    { url: 'https://tienda-production-e8c8.up.railway.app' } // Tu dominio
  ],
};

const outputFile = './openapi.json';
const endpointsFiles = ['./index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Documentación Swagger generada automáticamente.');

  // Abrir el archivo generado
  const data = JSON.parse(fs.readFileSync(outputFile));

  // Eliminar el host localhost que agrega automáticamente
  if (data.host) delete data.host;

  // Guardar cambios
  fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
  console.log('Host localhost eliminado y listo para producción.');
});
