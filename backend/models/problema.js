'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class problema extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  problema.init({
    ID:{
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true
  },
    COMENTARIO: DataTypes.STRING,
    TAREA_ID: DataTypes.STRING,
    FECHA: DataTypes.DATE,
    USUARIO_ID: DataTypes.INTEGER,
    FINALIZADA: DataTypes.STRING,
    ESTADO_ID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'problema',
    tableName: 'PROBLEMA_T',
    createdAt: false,
    updatedAt: false,
    id: false
  });
 
  return problema;
};