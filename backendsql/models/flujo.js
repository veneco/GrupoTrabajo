'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class flujo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  flujo.init({
    orden: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    deleted: DataTypes.INTEGER,
    valor: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'flujo',
    tableName: 'flujoproceso',
    createdAt: false,
    updatedAt: false,
  });
  return flujo;
};