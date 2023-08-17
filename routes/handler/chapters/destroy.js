const apiAdapter = require("../../apiAdapter");
const { URL_SERVICE_COURSE } = process.env;
// const URL_SERVICE_COURSE = 'http://127.0.0.1:8000';

const api = apiAdapter(URL_SERVICE_COURSE);

module.exports = async (req, res) => {
  try {
    const id = req.params.id;
    const chapter = await api.delete(`/api/chapters/${id}`);
    return res.json(chapter.data);
  } catch (error) {
    // kondisi saat service chapters mati
    if (error.code === "ECONNREFUSED") {
      return res
        .status(500)
        .json({ status: "error", message: "service unavailable" });
    }

    const { status, data } = error.response;
    return res.status(status).json(data);
  }
};
