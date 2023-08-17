const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

module.exports = async (req, res, next) => {
    // dapatkan token dari header authorization
    const token = req.headers.authorization;

    // verifikasi token
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) {
            return res.status(403).json({ message: err.message });
        }

        // inject data yang sudah terdecode ke object request api ini
        req.user = decoded;
        // jika tidak ada error akan lanjut ke route / middleware selanjutnya
        return next();
    })
}