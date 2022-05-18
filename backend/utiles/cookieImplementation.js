const cookieImplement = (data, status, res, msg) => {
  const token = data.generateJWTtoken();

  const options = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_EXPIRE) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    Secure: true,
  };
  res.status(status).cookie("token", token, options).json({
    data,
    error: false,
    msg,
  });
};

module.exports = cookieImplement;
