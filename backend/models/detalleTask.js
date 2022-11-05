'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  task.init({
    ID:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  },
    ACEPTA: DataTypes.STRING,
    RECHAZA: DataTypes.STRING,//
    REASIGNADA: DataTypes.STRING,
    USUARIO_ID: DataTypes.INTEGER,
    TAREA_ID: DataTypes.INTEGER,
    FECHA: DataTypes.DATE,

  }, {
    sequelize,
    modelName: 'detalleTask',
    tableName: 'DETALLETAREA',
    createdAt: false,
    updatedAt: false,
    id: false
  });
 

  return task;
};