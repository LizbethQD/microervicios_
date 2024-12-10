'use strict';
const modelsPromise = require('../models'); // Promesa de inicialización de los modelos

const obtenerFechaActual = function () {
    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1;
    const anio = fechaActual.getFullYear();

    // Formatear la fecha como "YYYY-MM-DD"
    return `${anio}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
};

class DatoRecolectadoControl {

    /* Listar los sensores y sus datos */
    async listar(req, res) {
        try {
            const models = await modelsPromise;
            const sensor = models.sensor;
            const datoRecolectado = models.datoRecolectado;

            const fechaHoy = obtenerFechaActual();

            const lista = await sensor.findAll({
                attributes: ["nombre", "ubicacion", "tipo_sensor", ["external_id", "id"]],
                include: [{
                    model: datoRecolectado,
                    as: "datoRecolectado",
                    where: { fecha: fechaHoy },
                    attributes: ["dato", 'fecha', 'hora']
                }]
            });

            res.status(200).json({ tag: "OK", code: 200, datos: lista });
        } catch (error) {
            console.error("Error al listar sensores y datos:", error);
            res.status(500).json({ tag: "ERROR", code: 500, msg: "Error al recuperar los datos" });
        }
    }

    /* Obtener la última temperatura registrada */
    async obtenerTemperatura(req, res) {
        try {
            const models = await modelsPromise;
            const sensor = models.sensor;
            const datoRecolectado = models.datoRecolectado;

            const lista = await sensor.findOne({
                attributes: ["nombre", "tipo_sensor"],
                where: { tipo_sensor: "TEMPERATURA" },
                include: [{
                    model: datoRecolectado,
                    as: "datoRecolectado",
                    order: [['fecha', 'DESC']],
                    limit: 1,
                    attributes: ["dato", 'fecha']
                }]
            });

            if (!lista) {
                return res.status(404).json({ tag: "ERROR", code: 404, msg: "Sensor de temperatura no encontrado" });
            }

            res.status(200).json({ tag: "OK", code: 200, datos: lista });
        } catch (error) {
            console.error("Error al obtener la temperatura:", error);
            res.status(500).json({ tag: "ERROR", code: 500, msg: "Error al recuperar los datos" });
        }
    }

    /* Buscar y listar sensores y datos por fecha */
    async listarFecha(req, res) {
        try {
            const models = await modelsPromise;
            const sensor = models.sensor;
            const datoRecolectado = models.datoRecolectado;

            const parametro = req.params.valorBusqueda;

            const lista = await sensor.findAll({
                attributes: ["nombre", "ubicacion", "tipo_sensor", ["external_id", "id"]],
                include: [{
                    model: datoRecolectado,
                    as: "datoRecolectado",
                    where: { fecha: parametro },
                    attributes: ["dato", 'fecha', 'hora']
                }]
            });

            res.status(200).json({ tag: "OK", code: 200, datos: lista });
        } catch (error) {
            console.error("Error al listar sensores por fecha:", error);
            res.status(500).json({ tag: "ERROR", code: 500, msg: "Error al recuperar los datos" });
        }
    }

    /* Buscar y listar sensores y datos por tipo de sensor */
    async listarTipo(req, res) {
        try {
            const models = await modelsPromise;
            const sensor = models.sensor;
            const datoRecolectado = models.datoRecolectado;

            const parametro = req.params.valorBusqueda;

            const lista = await sensor.findAll({
                where: { tipo_sensor: parametro },
                attributes: ["nombre", "ubicacion", "tipo_sensor", ["external_id", "id"]],
                include: [{
                    model: datoRecolectado,
                    as: "datoRecolectado",
                    attributes: ["dato", 'fecha', 'hora']
                }]
            });

            res.status(200).json({ tag: "OK", code: 200, datos: lista });
        } catch (error) {
            console.error("Error al listar sensores por tipo:", error);
            res.status(500).json({ tag: "ERROR", code: 500, msg: "Error al recuperar los datos" });
        }
    }

    /* Buscar y listar sensores y datos por nombre de sensor */
    async listarNombre(req, res) {
        try {
            const models = await modelsPromise;
            const sensor = models.sensor;
            const datoRecolectado = models.datoRecolectado;

            const parametro = req.params.valorBusqueda;

            const lista = await sensor.findAll({
                where: { nombre: parametro },
                attributes: ["nombre", "ubicacion", "tipo_sensor", ["external_id", "id"]],
                include: [{
                    model: datoRecolectado,
                    as: "datoRecolectado",
                    attributes: ["dato", 'fecha', 'hora']
                }]
            });

            res.status(200).json({ tag: "OK", code: 200, datos: lista });
        } catch (error) {
            console.error("Error al listar sensores por nombre:", error);
            res.status(500).json({ tag: "ERROR", code: 500, msg: "Error al recuperar los datos" });
        }
    }

}

module.exports = DatoRecolectadoControl;