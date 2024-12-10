'use strict';

const modelsPromise = require('../models'); // Promesa de inicialización de los modelos
const uuid = require('uuid');

class CatalogoControl {
    
    // Para listar todos los catálogos
    async listar(req, res) {
        try {
            const models = await modelsPromise;
            const catalogo = models.catalogo;

            const lista = await catalogo.findAll({
                attributes: ['nombre', 'rango_minimo', 'rango_maximo', 'informacion']
            });

            res.status(200).json({ msg: "OK", code: 200, datos: lista });
        } catch (error) {
            console.error("Error en listar catálogos:", error);
            res.status(500).json({ msg: "Error interno del servidor", code: 500 });
        }
    }

    // Para guardar un nuevo catálogo
    async guardar(req, res) {
        try {
            const models = await modelsPromise;
            const catalogo = models.catalogo;

            if (req.body.hasOwnProperty('nombre') &&
                req.body.hasOwnProperty('minimo') &&
                req.body.hasOwnProperty('maximo') &&
                req.body.hasOwnProperty('info')) {

                const data = {
                    nombre: req.body.nombre,
                    rango_minimo: req.body.minimo,
                    rango_maximo: req.body.maximo,
                    informacion: req.body.info,
                    external_id: uuid.v4()
                };

                const result = await catalogo.create(data);

                if (result) {
                    res.status(200).json({ msg: "OK", code: 200 });
                } else {
                    res.status(400).json({ msg: "ERROR", tag: "No se puede crear el catálogo", code: 400 });
                }
            } else {
                res.status(400).json({ msg: "ERROR", tag: "Faltan datos", code: 400 });
            }
        } catch (error) {
            console.error("Error en guardar catálogo:", error);
            res.status(500).json({ msg: "Error interno del servidor", code: 500 });
        }
    }
}

module.exports = CatalogoControl;