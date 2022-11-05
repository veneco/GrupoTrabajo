'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const oracledb = require('oracledb')
oracledb.initOracleClient({libDir: '..\\instantclient_21_7'})
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize({
    dialect: config.dialect,
    username: config.user,
    password: config.password,
    dialectOptions: {connectString: config.connectionString}

  })
  
 /* sequelize = new Sequelize({
    dialect: "oracle",
    username: "admin",
    password: "Duoc12345678",
    dialectOptions: {connectString: "processsa_high"}});*/
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
