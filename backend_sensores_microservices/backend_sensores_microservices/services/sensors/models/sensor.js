'use strict'

module.exports = (sequelize, DataTypes) => {

    const sensor = sequelize.define('sensor', {
        nombre: { type: DataTypes.STRING(150), defaultValue: "NONE" },
        img: { type: DataTypes.STRING, defaultValue: "NONE" },
        ubicacion: { type: DataTypes.STRING(255), defaultValue: "NONE" },
        tipo_sensor: { type: DataTypes.ENUM('TEMPERATURA', 'HUMEDAD', 'VIENTO', 'PRECIPITACION', 'RADIACION_SOLAR'), defaultValue: "TEMPERATURA" },
        ip: { type: DataTypes.STRING(50), defaultValue: "NONE" },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
        estado: { type: DataTypes.BOOLEAN, defaultValue: true },

    }, { freezeTableName: true });
    sensor.associate = function (models) {
        sensor.hasMany(models.datoRecolectado, { foreignKey: 'id_sensor', as: 'datoRecolectado' });
        sensor.hasOne(models.motaClimatica, { foreignKey: 'id_sensor', as: 'motaClimatica' });
    }
    return sensor;
}