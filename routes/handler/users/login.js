const jwt = require("jsonwebtoken");
const apiAdapter = require("../../apiAdapter");

const {
  URL_SERVICE_USER,
  JWT_SECRET,
  JWT_SECRET_REFRESH_TOKEN,
  JWT_ACCESS_TOKEN_EXPIRED,
  JWT_REFRESH_TOKEN_EXPIRED,
} = process.env;

const api = apiAdapter(URL_SERVICE_USER);

module.exports = async (req, res) => {
  try {
    const user = await api.post("/users/login", req.body);

    // ambil data dari axios, endpoint login user data
    const data = user.data.data;

    // buat token, payload data : data, bisa disangkat data saja
    const token = jwt.sign({ data }, JWT_SECRET, {
      expiresIn: JWT_ACCESS_TOKEN_EXPIRED,
    });
    const refreshToken = jwt.sign({ data }, JWT_SECRET_REFRESH_TOKEN, {
      expiresIn: JWT_REFRESH_TOKEN_EXPIRED,
    });

    await api.post("/refresh_tokens", {
      refresh_token: refreshToken,
      user_id: data.id,
    });

    return res.json({
      status: "success",
      data: {
        token,
        refresh_token: refreshToken,
      },
    });
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
