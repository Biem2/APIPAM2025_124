const db = require('../config/db');
const KategoriBudaya = db.kategori_budaya;

// POST - Membuat kategori baru
exports.createKategori = async (req, res) => {
    try {
        const { nama_kategori, deskripsi } = req.body;
        
        if (!nama_kategori) {
            return res.status(400).json({
                success: false,
                message: 'Nama kategori wajib diisi'
            });
        }

        const kategori = await KategoriBudaya.create({
            nama_kategori,
            deskripsi
        });

        res.status(201).json({
            success: true,
            message: 'Kategori berhasil dibuat',
            data: kategori
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: err.message 
        });
        console.log(err);
    }
};

// GET - Mengambil semua kategori
exports.getAllKategori = async (req, res) => {
    try {
        const kategori = await KategoriBudaya.findAll({
            order: [['id', 'DESC']]
        });

        res.status(200).json({
            success: true,
            message: 'Data kategori berhasil diambil',
            count: kategori.length,
            data: kategori
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
};

// GET - Mengambil kategori berdasarkan ID
exports.getKategoriById = async (req, res) => {
    try {
        const kategori = await KategoriBudaya.findByPk(req.params.id);

        if (!kategori) {
            return res.status(404).json({
                success: false,
                message: 'Kategori tidak ditemukan'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Kategori berhasil diambil',
            data: kategori
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
};

// PUT - Update kategori
exports.updateKategori = async (req, res) => {
    try {
        const { nama_kategori, deskripsi } = req.body;

        const kategori = await KategoriBudaya.findByPk(req.params.id);

        if (!kategori) {
            return res.status(404).json({
                success: false,
                message: 'Kategori tidak ditemukan'
            });
        }

        await KategoriBudaya.update(
            { nama_kategori, deskripsi },
            { where: { id: req.params.id } }
        );

        const updatedKategori = await KategoriBudaya.findByPk(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Kategori berhasil diupdate',
            data: updatedKategori
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
};

// DELETE - Hapus kategori
exports.deleteKategori = async (req, res) => {
    try {
        const kategori = await KategoriBudaya.findByPk(req.params.id);

        if (!kategori) {
            return res.status(404).json({
                success: false,
                message: 'Kategori tidak ditemukan'
            });
        }

        await KategoriBudaya.destroy({
            where: { id: req.params.id }
        });

        res.status(200).json({
            success: true,
            message: 'Kategori berhasil dihapus',
            data: kategori
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
};