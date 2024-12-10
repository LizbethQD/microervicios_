'use strict';
const modelsPromise = require('../models'); // Promesa de inicialización de los modelos
const fs = require('fs');
const expresionRegularIP = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;

class SensorControl {

    /*Listar los sensores guardados*/
    async listar(req, res) {
        try {
            const models = await modelsPromise;
            const sensor = models.sensor;

            const lista = await sensor.findAll({
                attributes: ['nombre', 'external_id', 'ubicacion', 'tipo_sensor', 'estado', 'img', 'ip'],
            });

            res.status(200).json({ tag: "OK", code: 200, datos: lista });
        } catch (error) {
            console.error("Error al listar sensores:", error);
            res.status(500).json({ tag: "Error", code: 500, error_msg: error.message });
        }
    }

    /*Busqueda y listado de sensores por tipo de sensor */
    async obtenerTipo(req, res) {
        try {
            const models = await modelsPromise;
            const sensor = models.sensor;
            let parametro = req.params.valorBusqueda;

            const lista = await sensor.findAll({
                where: { tipo_Sensor: parametro },
                attributes: ['nombre', 'external_id', 'ubicacion', 'tipo_sensor', 'estado', 'img', 'ip'],
            });

            res.status(200).json({ tag: "OK", code: 200, datos: lista });
        } catch (error) {
            console.error("Error al obtener sensores por tipo:", error);
            res.status(500).json({ tag: "Error", code: 500, error_msg: error.message });
        }
    }

    /*Busqueda y listado de sensores por nombre de sensor */
    async obtenerNombre(req, res) {
        try {
            const models = await modelsPromise;
            const sensor = models.sensor;
            let parametro = req.params.valorBusqueda;

            const lista = await sensor.findAll({
                where: { nombre: parametro },
                attributes: ['nombre', 'external_id', 'ubicacion', 'tipo_sensor', 'estado', 'img', 'ip'],
            });

            res.status(200).json({ tag: "OK", code: 200, datos: lista });
        } catch (error) {
            console.error("Error al obtener sensores por nombre:", error);
            res.status(500).json({ tag: "Error", code: 500, error_msg: error.message });
        }
    }

    /*Busqueda de un sensor*/
    async obtener(req, res) {
        try {
            const models = await modelsPromise;
            const sensor = models.sensor;
            const external = req.params.external;

            const lista = await sensor.findOne({
                where: { external_id: external },
                attributes: ['nombre', 'external_id', 'ubicacion', 'tipo_sensor', 'estado', 'img', 'ip'],
            });

            if (lista === null) {
                return res.status(404).json({ tag: "Error", code: 404, msg: "Sensor no encontrado" });
            }

            res.status(200).json({ tag: "OK!", code: 200, datos: lista });
        } catch (error) {
            console.error("Error al obtener el sensor:", error);
            res.status(500).json({ tag: "Error", code: 500, error_msg: error.message });
        }
    }

    /*Guardar datos de un sensor*/
    async guardar(req, res) {
        try {
            const models = await modelsPromise;
            const sensor = models.sensor;
            const senData = JSON.parse(req.body.sen);

            if (senData.hasOwnProperty('nombre') &&
                senData.hasOwnProperty('ip') &&
                senData.hasOwnProperty('ubicacion') &&
                senData.hasOwnProperty('tipo')) {

                if (expresionRegularIP.test(senData.ip)) {

                    const data = {
                        nombre: senData.nombre,
                        ip: senData.ip,
                        external_id: uuid.v4(),
                        ubicacion: senData.ubicacion,
                        tipo_sensor: senData.tipo,
                    }

                    let transaction = await models.sequelize.transaction();

                    try {
                        const aux = await sensor.create(data, { transaction });
                        await transaction.commit();

                        // Verifica si se han cargado archivos de imagen
                        if (req.files && req.files['img']) {
                            const filesImg = req.files['img'];
                            for (const file of filesImg) {
                                const imageUrl = `http://localhost:3006/multimedia/${file.filename}`;
                                aux.img = imageUrl;
                                await aux.save();
                            }
                        }

                        res.status(200).json({ msg: 'OK', tag: 'Sensor registrado correctamente', code: 200 });
                    } catch (error) {
                        await transaction.rollback();
                        console.error("Error al guardar el sensor:", error);
                        res.status(203).json({ tag: "Error", code: 203, error_msg: error.message });
                    }
                } else {
                    res.status(400).json({ msg: "Error", tag: "Direccion IP incorrecta", code: 400 });
                }
            } else {
                res.status(400).json({ msg: "ERROR", tag: "Faltan datos", code: 400 });
            }
        } catch (error) {
            console.error("Error al guardar el sensor:", error);
            res.status(500).json({ msg: "Error interno del servidor", code: 500 });
        }
    }

    /*Modificar los datos de un sensor*/
    async modificar(req, res) {
        try {
            const models = await modelsPromise;
            const sensor = models.sensor;
            const uuid = require('uuid');
            const doc = await sensor.findOne({ where: { external_id: req.params.external } });
            const senData = JSON.parse(req.body.sen);

            if (!doc) {
                return res.status(400).json({ msg: "Error", tag: "El dato a modificar no existe", code: 400 });
            }

            if (senData.hasOwnProperty('nombre') &&
                senData.hasOwnProperty('ip') &&
                senData.hasOwnProperty('ubicacion') &&
                senData.hasOwnProperty('tipo')) {

                if (expresionRegularIP.test(senData.ip)) {
                    const filesImg = req.files['img'];
                    let url = "";

                    if (doc.img) {
                        url = doc.img.split("/").pop();
                    }

                    if (filesImg && filesImg[0].filename !== url) {
                        fs.unlink('public/multimedia/' + url, (err) => {
                            if (err) {
                                console.error('Error al intentar eliminar el archivo:', err);
                            } else {
                                console.log('Archivo eliminado correctamente.');
                            }
                        });
                        doc.img = `http://localhost:3006/multimedia/${filesImg[0].filename}`;
                    }

                    doc.nombre = senData.nombre;
                    doc.ubicacion = senData.ubicacion;
                    doc.ip = senData.ip;
                    doc.tipo_sensor = senData.tipo;
                    doc.external_id = uuid.v4();

                    const result = await doc.save();

                    if (result) {
                        res.status(200).json({ msg: "Success", tag: "Datos modificados correctamente", code: 200 });
                    } else {
                        res.status(400).json({ msg: "Error", tag: "No se han modificado los datos", code: 400 });
                    }
                } else {
                    res.status(400).json({ msg: "Error", tag: "Direccion IP incorrecta", code: 400 });
                }
            } else {
                res.status(400).json({ msg: "Error", tag: "Faltan datos", code: 400 });
            }
        } catch (error) {
            console.error("Error al modificar el sensor:", error);
            res.status(500).json({ msg: "Error interno del servidor", code: 500 });
        }
    }

    /*Activar o desactivar un sensor*/
    async cambiarEstado(req, res) {
        try {
            const models = await modelsPromise;
            const sensor = models.sensor;
            const sen = await sensor.findOne({ where: { external_id: req.params.external } });
            const uuid = require('uuid');

            if (sen) {
                sen.external_id = uuid.v4();
                sen.estado = req.body.estado === "true";

                const result = await sen.save();

                if (result) {
                    res.status(200).json({ msg: "Success", tag: "Estado cambiado correctamente", code: 200 });
                } else {
                    res.status(400).json({ msg: "Error", tag: "No se ha modificado el estado", code: 400 });
                }
            } else {
                res.status(404).json({ msg: "Error", tag: "Sensor no encontrado", code: 404 });
            }
        } catch (error) {
            console.error("Error al cambiar el estado del sensor:", error);
            res.status(500).json({ msg: "Error interno del servidor", code: 500 });
        }
    }
}

module.exports = SensorControl;