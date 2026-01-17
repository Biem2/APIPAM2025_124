const express = require('express');
const router = express.Router();
const penilaianController = require('../controller/penilaianController');
const auth = require('../middleware/jwtVerify');

// Route untuk Penilaian/Rating
// GET: Semua orang (termasuk Guest) biasanya bisa melihat daftar penilaian
router.get('/', penilaianController.getAllPenilaian); 

router.get('/bybudaya/:budayaId', penilaianController.getPenilaianByBudaya); 

// GET: Melihat detail penilaian berdasarkan ID tertentu
router.get('/:id', penilaianController.getPenilaianById);

// POST: Menambah penilaian baru (WAJIB LOGIN)
router.post('/', auth, penilaianController.createPenilaian);

// PUT: Mengupdate penilaian yang sudah ada (WAJIB LOGIN)
router.put('/:id', auth, penilaianController.updatePenilaian);

// DELETE: Menghapus penilaian (WAJIB LOGIN)
router.delete('/:id', auth, penilaianController.deletePenilaian);

module.exports = router;