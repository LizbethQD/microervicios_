var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken');
const multer = require('multer');
const { body } = require('express-validator');

const catalogoC = require('../controllers/CatalogoControl')
let catalogoControl = new catalogoC();

//api catalogo
router.post('/admin/catalogo/guardar', catalogoControl.guardar);
router.get('/admin/catalogo', catalogoControl.listar);

module.exports = router;
