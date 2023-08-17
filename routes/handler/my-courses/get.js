const apiAdapter = require("../../apiAdapter");
const { URL_SERVICE_COURSE } = process.env;
// const URL_SERVICE_COURSE = 'http://127.0.0.1:8000';

const api = apiAdapter(URL_SERVICE_COURSE);

module.exports = async (req, res) => {
  try {
    // ambil data id user dari token
    const userId = req.user.data.id;

    const myCourses = await api.get("/api/my-courses", {
      params: {user_id: userId}
    });
    
    return res.json(myCourses.data);
  } catch (error) {
    // kondisi saat service myCourses mati
    if (error.code === "ECONNREFUSED") {
      return res
        .status(500)
        .json({ status: "error", message: "service unavailable" });
    }

    const { status, data } = error.response;
    return res.status(status).json(data);
  }
};
