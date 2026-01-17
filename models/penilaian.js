const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('penilaian', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    budaya_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'budaya',
        key: 'id'
      }
    },
    nilai: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    komentar: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'penilaian',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "fk_penilaian_user",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "fk_penilaian_budaya",
        using: "BTREE",
        fields: [
          { name: "budaya_id" },
        ]
      },
    ]
  });
};
