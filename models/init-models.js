var DataTypes = require("sequelize").DataTypes;
var _budaya = require("./budaya");
var _kategori_budaya = require("./kategori_budaya");
var _penilaian = require("./penilaian");
var _users = require("./users");

function initModels(sequelize) {
  var budaya = _budaya(sequelize, DataTypes);
  var kategori_budaya = _kategori_budaya(sequelize, DataTypes);
  var penilaian = _penilaian(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  penilaian.belongsTo(budaya, { as: "budaya", foreignKey: "budaya_id"});
  budaya.hasMany(penilaian, { as: "penilaians", foreignKey: "budaya_id"});
  budaya.belongsTo(kategori_budaya, { as: "kategori", foreignKey: "kategori_id"});
  kategori_budaya.hasMany(budaya, { as: "budayas", foreignKey: "kategori_id"});
  penilaian.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(penilaian, { as: "penilaians", foreignKey: "user_id"});

  return {
    budaya,
    kategori_budaya,
    penilaian,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
