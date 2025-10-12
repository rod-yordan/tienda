const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const expressOasGenerator = require('express-oas-generator');

const app = express();
const PORT = process.env.PORT || 3000;

expressOasGenerator.init(app, {
  swaggerUiServePath: '/docs', 
  specOutputPath: './openapi.json', 
  swaggerDocumentOptions: {
    info: {
      title: 'Tienda API',
      version: '1.0.0',
      description: 'Documentación generada automáticamente',
    },
    servers: [
      { url: 'http://localhost:3000' },
      { url: 'https://tienda-production-e8c8.up.railway.app' },
    ],
  },
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); 

// Rutas
const categoriasRoutes = require('./routes/categorias');
const productosRoutes = require('./routes/productos');
const imagenesRoutes = require('./routes/imagenes');
const authRoutes = require('./routes/routes'); 

app.use('/categorias', categoriasRoutes);
app.use('/productos', productosRoutes);
app.use('/imagenes', imagenesRoutes);
app.use('/api', authRoutes); 

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación Swagger: http://localhost:${PORT}/docs`);
});
