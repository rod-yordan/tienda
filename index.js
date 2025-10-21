const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./openapi.json');

const app = express();
const PORT = 3000; 

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Lista de IPs permitidas (las del instituto)
const allowedIPs = [
  '45.232.149.130',  
  '45.232.149.146',  
];

app.get('/check-access', (req, res) => {
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const cleanIP = clientIP.replace('::ffff:', '');

  console.log('Solicitud desde IP:', cleanIP);

  if (!allowedIPs.includes(cleanIP)) {
    return res.status(403).json({
      authorized: false,
      message: 'Acceso no autorizado desde esta red.'
    });
  }

  return res.json({
    authorized: true,
    message: 'Acceso permitido.'
  });
});

// Rutas
const categoriasRoutes = require('./routes/categorias');
const productosRoutes = require('./routes/productos');
const imagenesRoutes = require('./routes/imagenes');
const authRoutes = require('./routes/routes');

app.use('/categorias', categoriasRoutes);
app.use('/productos', productosRoutes);
app.use('/imagenes', imagenesRoutes);
app.use('/api', authRoutes);

// Documentación Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(`Documentación Swagger disponible en http://localhost:${PORT}/docs`);
});

