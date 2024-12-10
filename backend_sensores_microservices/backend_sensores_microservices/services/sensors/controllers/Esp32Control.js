'use strict';
const modelsPromise = require('../models'); // Promesa de inicialización de los modelos
const expresionRegularIP = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;

class Esp32Control {
    // Listar todos los dispositivos ESP32
    async listar(req, res) {
        try {
            const models = await modelsPromise;
            const esp32 = models.espMaestro;

            const lista = await esp32.findAll({
                attributes: ['ip', 'external_id']
            });

            res.status(200).json({ msg: "OK", code: 200, datos: lista });
        } catch (error) {
            console.error("Error al listar dispositivos ESP32:", error);
            res.status(500).json({ msg: "Error interno del servidor", code: 500 });
        }
    }

    // Guardar un nuevo dispositivo ESP32 o actualizar uno existente
    async guardar(req, res) {
        try {
            const models = await modelsPromise;
            const esp32 = models.espMaestro;
            const uuid = require('uuid');

            if (req.body.hasOwnProperty('ip')) {

                if (expresionRegularIP.test(req.body.ip)) {

                    let result;

                    if (req.body.external === undefined) {
                        // Crear un nuevo dispositivo si no se especifica external_id
                        const data = {
                            ip: req.body.ip,
                            external_id: uuid.v4()
                        };
                        result = await esp32.create(data);
                    } else {
                        // Actualizar un dispositivo existente si se especifica external_id
                        const espAux = await esp32.findOne({ where: { external_id: req.body.external } });

                        if (espAux) {
                            espAux.ip = req.body.ip;
                            espAux.external_id = uuid.v4();
                            result = await espAux.save();
                        } else {
                            return res.status(404).json({ msg: "ERROR", tag: "Dispositivo no encontrado", code: 404 });
                        }
                    }

                    if (result) {
                        res.status(200).json({ msg: "OK", code: 200 });
                    } else {
                        res.status(400).json({ msg: "ERROR", tag: "No se puede guardar", code: 400 });
                    }
                } else {
                    res.status(400).json({ msg: "Error", tag: "Dirección IP incorrecta", code: 400 });
                }
            } else {
                res.status(400).json({ msg: "ERROR", tag: "Faltan datos", code: 400 });
            }
        } catch (error) {
            console.error("Error al guardar dispositivo ESP32:", error);
            res.status(500).json({ msg: "Error interno del servidor", code: 500 });
        }
    }
}

module.exports = Esp32Control;