const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
const cors = require('cors');

const authRoutes = require("./routes/authRoutes");
const budayaRoutes = require("./routes/budayaRoutes");
const kategoriBudayaRoutes = require("./routes/kategoriBudayaRoutes"); // ⬅️ TAMBAHKAN INI
const penilaianRoutes = require("./routes/penilaianRoutes");

const app = express();

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!process.env.JWT_SECRET) {
    throw new Error("Secret key is not defined in the environment variables.");
}

const PORT = process.env.PORT; 
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }
  })
);

// ⬇️ DAFTARKAN ROUTES DI SINI
app.use("/api/auth", authRoutes);
app.use("/api/budaya", budayaRoutes);
app.use("/api/kategori", kategoriBudayaRoutes); // ⬅️ TAMBAHKAN INI
app.use("/api/reviews/budaya", penilaianRoutes);

// 404 handler harus di paling bawah
app.use((req, res) => {
    res.status(404).json({
        status: 404,
        error: "Not Found",
        message: "Endpoint tidak tersedia"
    });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Server is ready.\n\nSelamat Datang Admin!.\n');
});

module.exports = app;