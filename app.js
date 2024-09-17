const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Conexión a MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/Almacen', {
}).then(() => {
  console.log('Conectado a la base de datos Almacen');
}).catch((error) => {
  console.error('Error al conectar a la base de datos:', error);
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Para servir archivos estáticos como CSS
app.set('view engine', 'ejs');

// Definir el esquema del producto
const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  stock: Number
});

const Product = mongoose.model('productos', productSchema);

// Ruta para mostrar el formulario de agregar producto
app.get('/add', (req, res) => {
  res.render('addProduct');
});

// Ruta para agregar un producto
app.post('/add', (req, res) => {
  const newProduct = new Product({
    name: req.body.name,
    brand: req.body.brand,
    stock: req.body.stock
  });

  newProduct.save().then(() => {
    console.log('Producto agregado');
    res.redirect('/productos');
  }).catch((error) => {
    console.error('Error al agregar producto:', error);
    res.redirect('/add');
  });
});

// Ruta para ver los productos
app.get('/productos', (req, res) => {
  Product.find().then((products) => {
    res.render('viewProducts', { products: products });
  }).catch((error) => {
    console.error('Error al obtener productos:', error);
  });
});

// Servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
