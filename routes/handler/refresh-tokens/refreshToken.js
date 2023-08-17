const jwt = require("jsonwebtoken");

const apiAdapter = require("../../apiAdapter");
const {
  URL_SERVICE_USER,
  JWT_SECRET,
  JWT_SECRET_REFRESH_TOKEN,
  JWT_ACCESS_TOKEN_EXPIRED,
} = process.env;

const api = apiAdapter(URL_SERVICE_USER);

module.exports = async (req, res) => {
  try {
    const refreshToken = req.body.refresh_token;
    const email = req.body.email;

    // cek apakah dari frontend mengirimkan email / refresh token
    if (!refreshToken) {
      return res.status(400).json({
        status: "error",
        message: "invalid token",
      });
    }

    // cek ada tidaknya refresh token di database
    await api.get("/refresh_tokens", {
      params: { refresh_token: refreshToken },
    });

    // cek apakah refresh token valid dan tidak expired
    jwt.verify(refreshToken, JWT_SECRET_REFRESH_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          status: " error",
          message: err.message,
        });
      }

      // cek apakah emailnya valid dan sesuai dengan refresh tokennya
      if (email !== decoded.data.email) {
        return res.status(400).json({
          status: "error",
          message: "email is not valid",
        });
      }

      // jika token dan email sudah sesuai
      const token = jwt.sign({ data: decoded.data }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED });
      return res.json({
        status: "success",
        data: {
            token
        }
      })
    });

    // jika tidak ada akan error
  } catch (error) {
    // kondisi saat service user mati
    if (error.code === "ECONNREFUSED") {
      return res
        .status(500)
        .json({ status: "error", message: "service unavailable" });
    }

    const { status, data } = error.response;
    return res.status(status).json(data);
  }
};
