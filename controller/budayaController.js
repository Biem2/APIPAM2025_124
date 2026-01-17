const db = require('../config/db');
const Budaya = db.budaya;
const KategoriBudaya = db.kategori_budaya;

// POST - Membuat data budaya baru
exports.createBudaya = async (req, res) => {
  try {
    const { nama_budaya, deskripsi, asal_daerah, nama_kategori, gambar } = req.body;
    
    if (!nama_budaya) {
      return res.status(400).json({
        success: false,
        message: 'Nama budaya wajib diisi'
      });
    }
    
    if (!nama_kategori) {
      return res.status(400).json({
        success: false,
        message: 'Nama kategori wajib diisi'
      });
    }
    
    const kategori = await KategoriBudaya.findOne({
      where: { nama_kategori: nama_kategori }
    });
    
    if (!kategori) {
      return res.status(400).json({
        success: false,
        message: 'Kategori tidak ditemukan'
      });
    }
    
    const budaya = await Budaya.create({
      nama_budaya,
      deskripsi,
      asal_daerah,
      kategori_id: kategori.id,
      gambar
    });
    
    res.status(201).json({
      success: true,
      message: 'Data budaya berhasil dibuat',
      data: budaya
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal membuat data budaya',
      error: error.message
    });
  }
};

// GET - Mengambil semua data budaya dengan join kategori
exports.getAllBudaya = async (req, res) => {
  try {
    const budaya = await Budaya.findAll({
      include: [{
        model: KategoriBudaya,
        as: 'kategori',
        attributes: ['id', 'nama_kategori']
      }],
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      message: 'Data budaya berhasil diambil',
      count: budaya.length,
      data: budaya
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data budaya',
      error: error.message
    });
  }
};

// GET - Mengambil satu data budaya berdasarkan ID
exports.getBudayaById = async (req, res) => {
  try {
    const budaya = await Budaya.findByPk(req.params.id, {
      include: [{
        model: KategoriBudaya,
        as: 'kategori',
        attributes: ['id', 'nama_kategori']
      }]
    });
    
    if (!budaya) {
      return res.status(404).json({
        success: false,
        message: 'Data budaya tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Data budaya berhasil diambil',
      data: budaya
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data budaya',
      error: error.message
    });
  }
};

// PUT - Mengupdate data budaya berdasarkan ID
exports.updateBudaya = async (req, res) => {
  try {
    const { nama_budaya, deskripsi, asal_daerah, nama_kategori, gambar } = req.body;
    
    const budayaExists = await Budaya.findByPk(req.params.id);
    
    if (!budayaExists) {
      return res.status(404).json({
        success: false,
        message: 'Data budaya tidak ditemukan'
      });
    }
    
    let updateData = { nama_budaya, deskripsi, asal_daerah, gambar };
    
    if (nama_kategori) {
      const kategori = await KategoriBudaya.findOne({
        where: { nama_kategori: nama_kategori }
      });
      
      if (!kategori) {
        return res.status(400).json({
          success: false,
          message: 'Kategori tidak ditemukan'
        });
      }
      
      updateData.kategori_id = kategori.id;
    }
    
    await Budaya.update(updateData, {
      where: { id: req.params.id }
    });
    
    const budaya = await Budaya.findByPk(req.params.id, {
      include: [{
        model: KategoriBudaya,
        as: 'kategori',
        attributes: ['id', 'nama_kategori']
      }]
    });
    
    res.status(200).json({
      success: true,
      message: 'Data budaya berhasil diupdate',
      data: budaya
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal mengupdate data budaya',
      error: error.message
    });
  }
};

// DELETE - Menghapus data budaya berdasarkan ID
exports.deleteBudaya = async (req, res) => {
  try {
    const budaya = await Budaya.findByPk(req.params.id);
    
    if (!budaya) {
      return res.status(404).json({
        success: false,
        message: 'Data budaya tidak ditemukan'
      });
    }
    
    await Budaya.destroy({
      where: { id: req.params.id }
    });
    
    res.status(200).json({
      success: true,
      message: 'Data budaya berhasil dihapus',
      data: budaya
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus data budaya',
      error: error.message
    });
  }
};