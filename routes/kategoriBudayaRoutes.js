const express = require('express');
const router = express.Router();
const kategoriBudayaController = require('../controller/kategoriBudayaController');

// Routes untuk kategori budaya
router.get('/', kategoriBudayaController.getAllKategori);      // ← Ubah
router.get('/:id', kategoriBudayaController.getKategoriById);  // ← Ubah
router.post('/', kategoriBudayaController.createKategori);     // ← Ubah
router.put('/:id', kategoriBudayaController.updateKategori);   // ← Ubah
router.delete('/:id', kategoriBudayaController.deleteKategori); // ← Ubah

module.exports = router;