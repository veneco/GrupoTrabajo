'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class grupotrabajo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  grupotrabajo.init({
    ID:{
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
  },
    NOMBRE: DataTypes.STRING,
    DELETED: DataTypes.INTEGER,
    NEGOCIO_ID: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'grupotrabajo',
    tableName: 'GRUPOTRABAJO',
    createdAt: false,
    updatedAt: false,
    id: false
  });
  return grupotrabajo;
};