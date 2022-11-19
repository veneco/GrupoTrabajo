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
    NOMBRE: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'estado',
    tableName: 'ESTADO',
    createdAt: false,
    updatedAt: false,
    id: false
  });
 
  return problema;
};