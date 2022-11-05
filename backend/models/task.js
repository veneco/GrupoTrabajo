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
    ORDEN: DataTypes.INTEGER,
    FINALIZADA: DataTypes.STRING,//
    NOMBRE: DataTypes.STRING,
    DESCRIPCION: DataTypes.STRING,
    DURACION: DataTypes.INTEGER,
    FECHAINICIO: DataTypes.DATE,
    FECHAFIN: DataTypes.DATE,
    AVANCE: DataTypes.INTEGER,
    ETIQUETA_ID: DataTypes.INTEGER,
    DELETED: DataTypes.STRING,
    FLUJO_IN_ID: DataTypes.INTEGER,
    PREDECEDORA: DataTypes.INTEGER,
    SUBTAREA: DataTypes.STRING,
    

  }, {
    sequelize,
    modelName: 'task',
    tableName: 'TAREA',
    createdAt: false,
    updatedAt: false,
    id: false
  });
 

  return task;
};

