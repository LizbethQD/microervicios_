'use strict';

const modelsPromise = require('../models'); // Promesa de inicialización de los modelos
const schedule = require('node-schedule');
const axios = require('axios');
const uuid = require('uuid');

const obtenerFechaActual = () => {
    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1;
    const anio = fechaActual.getFullYear();
    return `${anio}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
};

const obtenerHoraActual = () => {
    const ahora = new Date();
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
};

const configurarJob = async () => {
    try {
        const models = await modelsPromise;
        const esp32 = await models.espMaestro.findOne();
        if (!esp32) {
            console.log("No se pudo obtener el maestro desde la base de datos. El job no se configurará.");
            return;
        }

        const cronExpression = `*/10 * * * *`; // Configurado para ejecutarse cada 10 minutos
        schedule.scheduleJob(cronExpression, async function () {
            console.log("Ejecutando tarea programada...");
            const lista = await models.sensor.findAll();
            const ipEsp = await models.espMaestro.findOne();

            for (const elemento of lista) {
                if (elemento.estado) {
                    const esp32URL = `http://${ipEsp.ip}/sensor?valor=${elemento.ip}`;
                    try {
                        const esp32Response = await axios.get(esp32URL, { timeout: 2000 });
                        const esp32Data = esp32Response.data;
                        console.log(elemento.ip);

                        if (esp32Response.status === 200 && esp32Data.dato) {
                            const datoSensor = esp32Data.dato;

                            const transaction = await models.sequelize.transaction();
                            try {
                                const data = {
                                    dato: datoSensor,
                                    hora: obtenerHoraActual(),
                                    fecha: obtenerFechaActual(),
                                    id_sensor: elemento.id,
                                    external_id: uuid.v4(),
                                };

                                const result = await models.datoRecolectado.create(data, { transaction });
                                await transaction.commit();

                                if (result) {
                                    console.log("Datos guardados correctamente.");
                                } else {
                                    console.log("No se pudo guardar los datos.");
                                }
                            } catch (error) {
                                if (transaction) await transaction.rollback();
                                console.error("Error al guardar los datos:", error.message);
                            }
                        } else {
                            console.error("Error en la respuesta del servidor:", esp32Response.statusText);
                            console.error("Mensaje de respuesta:", esp32Data.msg || 'No se encontró el dato');
                        }
                    } catch (error) {
                        console.error("Error al realizar la solicitud al ESP32:", error.message);
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error al configurar el job:", error.message);
    }
};

configurarJob();

class ConexionControl {
    
    /*Listar los sensores y sus datos */
    async listar(req, res) {
        try {
            const fechaHoy = obtenerFechaActual();
            const models = await modelsPromise;
            const lista = await models.sensor.findAll({
                attributes: ["nombre", "ubicacion", "tipo_sensor", ["external_id", "id"]],
                include: [{
                    model: models.datoRecolectado, as: "datoRecolectado",
                    where: { fecha: fechaHoy },
                    attributes: ["dato", 'fecha', 'hora']
                }]
            });

            res.status(200).json({ msg: "OK", code: 200, datos: lista });
        } catch (error) {
            console.error("Error al listar los sensores:", error.message);
            res.status(500).json({ msg: "Error interno del servidor", code: 500 });
        }
    }
}

module.exports = ConexionControl;