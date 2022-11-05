'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class prioridad extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  prioridad.init({
    ID:{
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
  },
    NOMBRE: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'prioridad',
    tableName: 'PRIORIDAD',
    createdAt: false,
    updatedAt: false,
    id: false
  });
  return prioridad;
};