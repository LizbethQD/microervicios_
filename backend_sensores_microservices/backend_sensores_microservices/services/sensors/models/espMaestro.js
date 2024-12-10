'use strict'

module.exports = (sequelize, DataTypes) => {

    const espMaestro = sequelize.define('espMaestro', {
        ip: { type: DataTypes.STRING(50), defaultValue: "NONE" },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }

    }, { freezeTableName: true });
    espMaestro.associate = function (models) {
    }
    return espMaestro;
}