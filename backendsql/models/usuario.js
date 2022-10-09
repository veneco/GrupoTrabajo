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
    correo: DataTypes.STRING,
    password: DataTypes.STRING,
    rut: DataTypes.STRING,
    nombre: DataTypes.STRING,
    apellidop: DataTypes.STRING,
    apellidom: DataTypes.STRING,
    celular: DataTypes.STRING,
    deleted: DataTypes.INTEGER,
    rol_id: DataTypes.INTEGER,
    negocio_id: DataTypes.INTEGER,
    grupotrabajo_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'usuario',
    tableName: 'usuario',
    createdAt: false,
    updatedAt: false,
  });
 
  return usuario;
};