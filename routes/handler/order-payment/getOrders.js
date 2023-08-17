const apiAdapter = require("../../apiAdapter");
// const { URL_SERVICE_ORDER_PAYMENT } = process.env;
const URL_SERVICE_ORDER_PAYMENT = 'http://127.0.0.1:8001';

const api = apiAdapter(URL_SERVICE_ORDER_PAYMENT);

module.exports = async (req, res) => {
  try {
    // ambil data id user dari token
    const userId = req.user.data.id;

    const orders = await api.get("/api/orders", {
      params: { user_id: userId },
    });

    return res.json(orders.data);
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      return res
        .status(500)
        .json({ status: "error", message: "service unavailable" });
    }
    const { status, data } = error.response;
    return res.status(status).json(data);
  }
};
