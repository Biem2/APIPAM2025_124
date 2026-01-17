const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.register = async (req, res) => {
    const {
        nama, email, password
    } = req.body;

    if (!nama || !email || !password) {
        return res.status(400).json({
            message: 'nama ,email, password wajib diisi.'
        });
    }

    try {
        const namaTrim = String(nama).trim();

        const existing = await db.users.findOne({ where: { nama: namaTrim } });

        if (existing) {
            return res.status(409).json({ message: 'user sudah terdaftar.' });
        }
        const trans = await db.sequelize.transaction();
        try {
           const saltRounds = parseInt(process.env.ROUND, 10);

            // Periksa apakah konversi berhasil dan memiliki nilai yang wajar (opsional)
            if (isNaN(saltRounds) || saltRounds < 4 || saltRounds > 31) {
                console.error('Invalid or missing ROUND environment variable. Defaulting to 10.');
                saltRounds = 10; // Gunakan nilai default yang aman
            }
            const hashPassword = await bcrypt.hash(password, saltRounds);
            const userPayload = {
                nama: namaTrim,
                email: email,
                password: hashPassword,
            };
            const registerUser = await db.users.create(userPayload, { transaction: trans });

            await trans.commit();

            console.log(registerUser);

            return res.status(201).json({
                message: 'Pengguna berhasil didaftarkan.',
            });
        } catch (errTx) {
            await trans.rollback();
            console.error('Transaction error in register:', errTx);
            const errorMsg = errTx && errTx.message ? errTx.message : 'Gagal menyimpan data (transaksi dibatalkan).';
            return res.status(500).json({ message: 'Rollback', error: errorMsg });
            // return res.redirect('/register?error=' + encodeURIComponent(errorMsg));
        }
    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'email dan password kosong.' });
        }
        const foundUser = await db.users.findOne({ where: { email } });
        if (!foundUser) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({
            id: foundUser.id,
            role: foundUser.role
        },
            process.env.JWT_SECRET,
            { expiresIn: '1d' });
        res.json({
            message: 'Login successful',
            token,
            user:
            {
                id: foundUser.userid,
                email: foundUser.email,
                role: foundUser.role,
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}