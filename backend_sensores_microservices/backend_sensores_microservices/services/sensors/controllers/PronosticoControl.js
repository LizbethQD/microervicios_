'use strict';
const modelsPromise = require('../models'); // Promesa de inicialización de los modelos
const { spawn } = require('child_process');
const { Op } = require('sequelize');

class PronosticoControl {

    // Método para obtener pronóstico de temperatura
    async obtenerPronostico(req, res) {
        try {
            const models = await modelsPromise;
            const sensor = models.sensor;

            const fechaHaceTresDias = new Date();
            fechaHaceTresDias.setDate(fechaHaceTresDias.getDate() - 4);

            const lista = await sensor.findAll({
                attributes: ["nombre", "tipo_sensor"],
                where: { tipo_sensor: "TEMPERATURA" },
                include: [{
                    model: models.datoRecolectado,
                    as: "datoRecolectado",
                    attributes: ["dato", 'hora', 'fecha'],
                    where: {
                        fecha: {
                            [Op.between]: [fechaHaceTresDias, new Date()]
                        }
                    }
                }]
            });

            const datosArray = lista.flatMap(item => Array.isArray(item.datoRecolectado) ? item.datoRecolectado.map(dato => dato.dato) : []);
            const datosArray2 = lista.flatMap(item => Array.isArray(item.datoRecolectado) ? item.datoRecolectado.map(dato => dato.hora) : []);

            const scriptPath = '../python/pronostico.py';

            const comando = spawn('python3', [scriptPath, ...datosArray, ...datosArray2]);

            let outputData = '';

            // Escucha los eventos de salida del proceso
            comando.stdout.on('data', (data) => {
                outputData += data;
            });

            comando.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            comando.on('close', (code) => {
                const matchTempActual = outputData.match(/TemperaturaActual: (\d+(\.\d+)?)/);
                const matchTempExtrapoladas = outputData.match(/Temperaturas: (.*)/);

                if (matchTempActual && matchTempExtrapoladas) {
                    const temperaturaActual = parseFloat(matchTempActual[1]);
                    const temperaturasExtrapoladas = JSON.parse(matchTempExtrapoladas[1]);

                    // Envía la respuesta con los valores
                    res.status(200).json({
                        msg: "OK",
                        code: 200,
                        temperaturasExtrapoladas: temperaturasExtrapoladas,
                    });
                } else {
                    // Maneja el caso en el que no se pudieron extraer los valores
                    res.status(500).json({ msg: "Error al analizar la salida", code: 500 });
                }
            });
        } catch (error) {
            console.error("Error en obtenerPronostico:", error);
            res.status(500).json({ msg: "Error interno del servidor", code: 500 });
        }
    }

    // Método para obtener pronóstico de humedad
    async obtenerPronosticoH(req, res) {
        try {
            const models = await modelsPromise;
            const sensor = models.sensor;

            const fechaHaceTresDias = new Date();
            fechaHaceTresDias.setDate(fechaHaceTresDias.getDate() - 4);

            const lista = await sensor.findAll({
                attributes: ["nombre", "tipo_sensor"],
                where: { tipo_sensor: "HUMEDAD" },
                include: [{
                    model: models.datoRecolectado,
                    as: "datoRecolectado",
                    attributes: ["dato", 'hora', 'fecha'],
                    where: {
                        fecha: {
                            [Op.between]: [fechaHaceTresDias, new Date()]
                        }
                    }
                }]
            });

            const datosArray = lista.flatMap(item => Array.isArray(item.datoRecolectado) ? item.datoRecolectado.map(dato => dato.dato) : []);
            const datosArray2 = lista.flatMap(item => Array.isArray(item.datoRecolectado) ? item.datoRecolectado.map(dato => dato.hora) : []);

            const scriptPath = '../python/pronostico.py';

            const comando = spawn('python3', [scriptPath, ...datosArray, ...datosArray2]);

            let outputData = '';

            // Escucha los eventos de salida del proceso
            comando.stdout.on('data', (data) => {
                outputData += data;
            });

            comando.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            comando.on('close', (code) => {
                const matchHumeActual = outputData.match(/TemperaturaActual: (\d+(\.\d+)?)/);
                const matchHumeExtrapoladas = outputData.match(/Temperaturas: (.*)/);

                if (matchHumeActual && matchHumeExtrapoladas) {
                    const humedadesExtrapoladas = JSON.parse(matchHumeExtrapoladas[1]);

                    // Envía la respuesta con los valores
                    res.status(200).json({
                        msg: "OK",
                        code: 200,
                        humedadesExtrapoladas: humedadesExtrapoladas
                    });
                } else {
                    // Maneja el caso en el que no se pudieron extraer los valores
                    res.status(500).json({ msg: "Error al analizar la salida", code: 500 });
                }
            });
        } catch (error) {
            console.error("Error en obtenerPronosticoH:", error);
            res.status(500).json({ msg: "Error interno del servidor", code: 500 });
        }
    }

    // Método para obtener pronóstico móvil de temperatura
    async obtenerPronosticoMovil(req, res) {
        try {
            const models = await modelsPromise;
            const sensor = models.sensor;

            const fecha = new Date();
            fecha.setDate(fecha.getDate() - 4);

            const lista = await sensor.findAll({
                attributes: ["nombre", "tipo_sensor"],
                where: { tipo_sensor: "TEMPERATURA" },
                include: [{
                    model: models.datoRecolectado,
                    as: "datoRecolectado",
                    attributes: ["dato", 'hora', 'fecha'],
                    where: {
                        fecha: {
                            [Op.between]: [fecha, new Date()]
                        }
                    }
                }]
            });

            const datosArray = lista.flatMap(item => Array.isArray(item.datoRecolectado) ? item.datoRecolectado.map(dato => dato.dato) : []);
            const datosArray2 = lista.flatMap(item => Array.isArray(item.datoRecolectado) ? item.datoRecolectado.map(dato => dato.hora) : []);

            const scriptPath = '../python/pronostico.py';

            const comando = spawn('python3', [scriptPath, ...datosArray, ...datosArray2]);

            let outputData = '';

            // Escucha los eventos de salida del proceso
            comando.stdout.on('data', (data) => {
                outputData += data;
            });

            comando.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            comando.on('close', (code) => {
                const matchTempActual = outputData.match(/TemperaturaActual: (\d+(\.\d+)?)/);
                const matchTempExtrapoladas = outputData.match(/Temperaturas: (.*)/);

                if (matchTempActual && matchTempExtrapoladas) {
                    const temperaturaActual = parseFloat(matchTempActual[1]);
                    const temperaturasExtrapoladas = JSON.parse(matchTempExtrapoladas[1]);

                    let datos = [];
                    const hora = fecha.getHours();
                    for (let i = hora; i < 24; i++) {
                        datos.push(i + ":00");
                    }

                    // Envía la respuesta con los valores
                    res.status(200).json({
                        msg: "OK",
                        code: 200,
                        temperaturasExtrapoladas: temperaturasExtrapoladas,
                        horas: datos
                    });
                } else {
                    // Maneja el caso en el que no se pudieron extraer los valores
                    res.status(500).json({ msg: "Error al analizar la salida", code: 500 });
                }
            });
        } catch (error) {
            console.error("Error en obtenerPronosticoMovil:", error);
            res.status(500).json({ msg: "Error interno del servidor", code: 500 });
        }
    }
}

module.exports = PronosticoControl;