module.exports = (...roles) => {
    return (req, res, next) => {
      const role = req.user.data.role;
      // cek apakah user punya akses?
      if (!roles.includes(role)) {
        return res
          .status(405)
          .json({
            status: 'error',
            message: 'you dont have permission'
          })
      }
  
      // jika ada akses langsung lanjut ke fungsi berikutnya
      return next();
    }
  }