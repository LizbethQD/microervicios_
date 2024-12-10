'use strict'

module.exports = (sequelize, DataTypes) => {
    const datoRecolectado = sequelize.define('datoRecolectado', {
        dato: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
        fecha: { 
            type: DataTypes.DATEONLY,  
            defaultValue: DataTypes.NOW // Usa `DataTypes.NOW` para la fecha actual
        },
        hora: { type: DataTypes.STRING(10), defaultValue: "NO DATA" },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, {freezeTableName: true });

    datoRecolectado.beforeCreate((dato) => {
        if (!dato.fecha) {
            dato.fecha = new Date().toISOString().split('T')[0];
        }
    });

    datoRecolectado.associate = function (models) {
        datoRecolectado.belongsTo(models.sensor, {foreignKey: 'id_sensor'});
    }
    return datoRecolectado;
}