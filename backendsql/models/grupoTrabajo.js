'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class grupotrabajo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  grupotrabajo.init({

    nombre: DataTypes.STRING,
    deleted: DataTypes.INTEGER,
    negocio_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'grupotrabajo',
    tableName: 'grupotrabajo',
    createdAt: false,
    updatedAt: false,
  });
  return grupotrabajo;
};