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
    creadapor: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    responsable: DataTypes.STRING,
    fechainicio: DataTypes.DATE,
    fechafin: DataTypes.DATE,
    esflujo: DataTypes.INTEGER,
    deleted: DataTypes.INTEGER,
    flujoproceso_id: DataTypes.INTEGER,
    grupotrabajo_id: DataTypes.INTEGER,
    estadotarea_id: DataTypes.INTEGER,
    prioridad_id: DataTypes.INTEGER,
    etiqueta_id: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'task',
    tableName: 'tarea',
    createdAt: false,
    updatedAt: false,
  });
 

  return task;
};