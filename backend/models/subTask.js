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
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
  },
    FINALIZADA: DataTypes.INTEGER,
    NOMBRE: DataTypes.STRING,
    DESCRIPCION: DataTypes.STRING,
    REASIGNADA: DataTypes.STRING,
    DELETED: DataTypes.INTEGER,
    TAREA_ID: DataTypes.INTEGER,
    FLUJOPROCESO_ID: DataTypes.INTEGER,
    ESTADOTAREA_ID: DataTypes.INTEGER,
    PRIORIDAD_ID: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'subtask',
    tableName: 'SUBTAREA',
    createdAt: false,
    updatedAt: false,
    id: false
  });
 

  return task;
};