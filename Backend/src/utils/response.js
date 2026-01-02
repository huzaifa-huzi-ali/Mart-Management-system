exports.success = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
};

exports.error = (res, message = 'Error', statusCode = 500, err = null) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    error: err ? err.toString() : undefined
  });
};
