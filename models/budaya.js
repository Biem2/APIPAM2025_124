const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('budaya', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    kategori_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'kategori_budaya',
        key: 'id'
      }
    },
    nama_budaya: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    asal_daerah: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    gambar: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'budaya',
    timestamps: true,        // ← Aktifkan timestamps
    underscored: true,       // ← TAMBAHKAN INI (gunakan snake_case)
    createdAt: 'created_at', // ← Map ke nama kolom database
    updatedAt: false,  // ← Jika ada kolom updated_at
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
        name: "fk_budaya_kategori",
        using: "BTREE",
        fields: [
          { name: "kategori_id" },
        ]
      },
    ]
  });
};
