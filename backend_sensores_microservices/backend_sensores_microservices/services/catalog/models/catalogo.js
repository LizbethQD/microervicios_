'use strict'

module.exports = (sequelize, DataTypes) => {

    const catalogo = sequelize.define('catalogo', {
        nombre: { type: DataTypes.STRING(150), defaultValue: "NONE" },
        rango_minimo: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
        rango_maximo: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
        informacion: { type: DataTypes.STRING(150), defaultValue: "NONE" },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }

    }, { freezeTableName: true });
    catalogo.associate = function (models) {

    }
    return catalogo;
}