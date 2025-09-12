const errorMiddleware = (err, req, res, next) => {
    res.status(err.status || 500).json({
        resp: 0,
        msg: err.message || "Internal Server Error",
        data: null
    });
};
  
module.exports = errorMiddleware;
  