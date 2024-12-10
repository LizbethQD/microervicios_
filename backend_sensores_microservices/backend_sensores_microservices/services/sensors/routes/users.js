var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken');
const multer = require('multer');
const { body } = require('express-validator');

const DatoRecolectadoControl = require('../controllers/DatoRecolectadoControl');
var datoControl = new DatoRecolectadoControl();
const sensorC = require('../controllers/SensorControl')
let sensoresControl = new sensorC();
const espC = require('../controllers/Esp32Control')
let Esp32Maestro = new espC();
const pronosticoC = require('../controllers/PronosticoControl')
let pronosticoControl = new pronosticoC();

//Filtro para extenciones de imagenes sensores
const fileFilter = (req, file, cb) => {
  const extensiones = ['jpg', 'png', "jpeg"]

  // Verifica la extensión del archivo
  const isValidExtension = extensiones.includes(file.originalname.split('.').pop());

  if (isValidExtension) {
    cb(null, true);
  } else {
    cb(new Error('Archivo no permitido'));
  }
};

//guardar imagenes
const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/multimedia');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: Storage,
  fileFilter: fileFilter,
});

//api sensores
router.get('/admin/sensores', sensoresControl.listar);
router.post('/admin/sensores/guardar', upload.fields([{ name: 'img', maxCount: 1 }]), sensoresControl.guardar);
router.post('/admin/sensores/modificar/:external', upload.fields([{ name: 'img', maxCount: 1 }]), sensoresControl.modificar);
router.get('/admin/sensores/buscar/tipo/:valorBusqueda', sensoresControl.obtenerTipo);
router.get('/admin/sensores/buscar/nombre/:valorBusqueda', sensoresControl.obtenerNombre);
router.get('/admin/sensores/obtener/:external', sensoresControl.obtener);
router.post('/admin/sensores/estado/:external', sensoresControl.cambiarEstado);

//api datos sensores
router.get('/sensores', datoControl.listar);
router.get('/sensores/buscar/tipo/:valorBusqueda', datoControl.listarTipo);
router.get('/sensores/buscar/fecha/:valorBusqueda', datoControl.listarFecha);
router.get('/sensores/buscar/nombre/:valorBusqueda', datoControl.listarNombre);

//api configuracion datos esp32 maestro
router.get('/admin/config', Esp32Maestro.listar);

router.post('/admin/config/guardar', Esp32Maestro.guardar);

//api pronosticos
router.get('/pronosticos/obtener', pronosticoControl.obtenerPronostico);
router.get('/pronosticos/obtenerH', pronosticoControl.obtenerPronosticoH);

//api movil sensor
router.get('/sensores/temperatura', datoControl.obtenerTemperatura);
router.get('/pronosticos/lista', pronosticoControl.obtenerPronosticoMovil);

module.exports = router;
