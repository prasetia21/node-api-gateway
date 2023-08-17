const apiAdapter = require("../../apiAdapter");
const { URL_SERVICE_COURSE, HOSTNAME } = process.env;
// const URL_SERVICE_COURSE = 'http://127.0.0.1:8000';

const api = apiAdapter(URL_SERVICE_COURSE);

module.exports = async (req, res) => {
  try {
    // fetch data dengan filter status published
    const courses = await api.get("/api/courses", {
      params: {
        ...req.query,
        status: "published"
      }
    });

    // ubah alamat host service bawaan ke service api gateway
    const coursesData = courses.data;
    const firstPage = coursesData.data.first_page_url.split("?").pop();
    const lastPage = coursesData.data.last_page_url.split("?").pop();

    coursesData.data.first_page_url = `${HOSTNAME}/courses?${firstPage}`;
    coursesData.data.last_page_url = `${HOSTNAME}/courses?${lastPage}`;

    if (coursesData.data.prev_page_url) {
      const prevPage = coursesData.data.prev_page_url.split("?").pop();
      coursesData.data.prev_page_url = `${HOSTNAME}/courses?${prevPage}`;
    }

    if (coursesData.data.next_page_url) {
      const nextPage = coursesData.data.next_page_url.split("?").pop();
      coursesData.data.next_page_url = `${HOSTNAME}/courses?${nextPage}`;
    }

    coursesData.data.path = `${HOSTNAME}/courses`;

    return res.json(coursesData);
  } catch (error) {
    // kondisi saat service courses mati
    if (error.code === "ECONNREFUSED") {
      return res
        .status(500)
        .json({ status: "error", message: "service unavailable" });
    }

    const { status, data } = error.response;
    return res.status(status).json(data);
  }
};
