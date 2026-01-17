const express = require('express');
const router = express.Router();
const budayaController = require('../controller/budayaController');

// ✅ SEMUA BOLEH AKSES (guest, user, admin)
// GET - Mengambil semua data budaya
router.get('/', budayaController.getAllBudaya);

// GET - Mengambil satu data budaya berdasarkan ID
router.get('/:id', budayaController.getBudayaById);

// POST - Membuat data budaya baru
router.post('/', budayaController.createBudaya);

// PUT - Mengupdate data budaya berdasarkan ID
router.put('/:id', budayaController.updateBudaya);

// DELETE - Menghapus data budaya berdasarkan ID
router.delete('/:id', budayaController.deleteBudaya);

module.exports = router;
