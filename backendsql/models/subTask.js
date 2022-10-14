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
    finalizada: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    responsable: DataTypes.STRING,
    deleted: DataTypes.INTEGER,
    tarea_id: DataTypes.INTEGER,
    flujoproceso_id: DataTypes.INTEGER,
    estadotarea_id: DataTypes.INTEGER,
    prioridad_id: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'subtask',
    tableName: 'subtarea',
    createdAt: false,
    updatedAt: false,
  });
 

  return task;
};