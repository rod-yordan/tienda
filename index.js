const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./openapi.json');

const app = express();
const PORT = process.env.PORT || 8080; // Railway asigna automáticamente este puerto

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

// Ruta raíz (para Railway)
app.get('/', (req, res) => {
  res.send('✅ API de Tienda funcionando correctamente');
});

// Documentación Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
  console.log(`📘 Documentación Swagger disponible en /docs`);
});

