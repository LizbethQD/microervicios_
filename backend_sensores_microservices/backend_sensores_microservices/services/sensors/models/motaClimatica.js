'use strict'

module.exports = (sequelize, DataTypes) => {
    const motaClimatica = sequelize.define('motaClimatica', {
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
        id_persona: { type: DataTypes.UUID, allowNull: false } 
    }, { 
        freezeTableName: true 
    });

    motaClimatica.associate = function (models) {
        motaClimatica.belongsTo(models.sensor, { foreignKey: 'id_sensor' });
    }

    return motaClimatica;
}