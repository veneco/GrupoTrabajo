'use strict';

const jwt = require('jsonwebtoken')
const {
  Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  usuario.init({
    ID:{
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
  },
    CORREO: DataTypes.STRING,
    PASSWORD: DataTypes.STRING,
    RUT: DataTypes.STRING,
    NOMBRE: DataTypes.STRING,
    APELLIDOP: DataTypes.STRING,
    APELLIDOM: DataTypes.STRING,
    CELULAR: DataTypes.STRING,
    DELETED: DataTypes.INTEGER,
    ROL_ID: DataTypes.INTEGER,
    NEGOCIO_ID: DataTypes.INTEGER,
    GRUPOTRABAJO_ID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'usuario',
    tableName: 'USUARIO',
    createdAt: false,
    updatedAt: false,
    id: false
  });
 
  return usuario;
};