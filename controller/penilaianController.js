const db = require('../config/db');

// 1. Ambil Penilaian berdasarkan ID Budaya (Ini yang dipanggil di log Kotlin kamu)
// Endpoint: GET /api/reviews/budaya/:budayaId
exports.getPenilaianByBudaya = async (req, res) => {
    try {
        const { budayaId } = req.params;
        const data = await db.penilaian.findAll({
            where: { budaya_id: budayaId },
            include: [
                { 
                    model: db.users, 
                    as: "user", 
                    attributes: ['nama', 'email'] 
                }
            ],
            order: [['id', 'DESC']]
        });

        // LOGIC LAMA ANDA TERBALIK.
        // Cek apakah array data memiliki isi.
        if (data.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Review berhasil diambil",
                data: data // Mengirim array review
            });
        } else {
            // Jika kosong, tetap kirim array kosong [] agar Android tidak crash
            return res.status(200).json({
                success: true,
                message: "Review tidak ditemukan",
                data: [] 
            });
        }

    } catch (err) {
        console.error("Error getPenilaianByBudaya:", err);
        res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
};

// 2. Ambil SEMUA Penilaian (GET /api/reviews)
exports.getAllPenilaian = async (req, res) => {
    try {
        const dataPenilaian = await db.penilaian.findAll({
            include: [
                { 
                    model: db.users, 
                    as: "user", 
                    attributes: ['nama', 'email'] 
                },
                { 
                    model: db.budaya, 
                    as: "budaya", 
                    attributes: ['nama_budaya'] 
                }
            ]
        });
        res.status(200).json(dataPenilaian);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 3. Ambil Penilaian Berdasarkan ID Penilaian (GET /api/reviews/:id)
exports.getPenilaianById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await db.penilaian.findByPk(id, {
            include: [{ model: db.users, as: "user", attributes: ['nama'] }]
        });

        if (!data) return res.status(200).json({ message: "Review tidak ditemukan" });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 4. Buat Penilaian Baru (POST /api/reviews)
exports.createPenilaian = async (req, res) => {
    try {
        const { budaya_id, nilai, komentar } = req.body;
        
        // Cek input dasar
        if (!budaya_id || !nilai) {
            return res.status(400).json({ message: "Budaya ID dan Nilai wajib diisi" });
        }

        const baru = await db.penilaian.create({
            user_id: req.user.id, // Pastikan middleware auth sudah jalan
            budaya_id,
            nilai,
            komentar
        });
        res.status(201).json({ message: "Berhasil memberikan penilaian", data: baru });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 5. Update Penilaian (PUT /api/reviews/:id)
exports.updatePenilaian = async (req, res) => {
    try {
        const { id } = req.params;
        const { nilai, komentar } = req.body;
        const review = await db.penilaian.findByPk(id);

        if (!review) return res.status(404).json({ message: "Data tidak ditemukan" });

        // Proteksi: Hanya pemilik yang bisa edit
        if (review.user_id !== req.user.id) {
            return res.status(403).json({ message: "Bukan milik Anda" });
        }

        await review.update({ nilai, komentar });
        res.status(200).json({ message: "Update berhasil", data: review });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 6. Hapus Penilaian (DELETE /api/reviews/:id)
exports.deletePenilaian = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await db.penilaian.findByPk(id);

        if (!review) return res.status(404).json({ message: "Data tidak ditemukan" });
        if (review.user_id !== req.user.id) {
            return res.status(403).json({ message: "Akses ditolak" });
        }

        await review.destroy();
        res.status(200).json({ message: "Berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};