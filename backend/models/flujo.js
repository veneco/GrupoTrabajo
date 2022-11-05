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
    ID:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  },
    RESPONSABLE: DataTypes.STRING,
    NOMBRE: DataTypes.STRING,
    DESCRIPCION: DataTypes.STRING,
    DELETED: DataTypes.INTEGER,
    FECHAINICIO: DataTypes.DATE,
    GRUPOTRABAJO_ID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'flujo',
    tableName: 'FLUJO_IN',
    createdAt: false,
    updatedAt: false,
    id: false
  });
  return flujo;
};