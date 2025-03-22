const jwt = require('jsonwebtoken')

const generateAccessToken = (user) => {
  return jwt.sign(
    user,
    process.env.SECRET_KEY,
    {
      expiresIn: '5m'
    }
  )
}

const signRefreshToken = (user) => {
  return jwt.sign(
    user, process.env.REFRESH_KEY,
    {
      expiresIn: '1h'
    }
  )
}

const refreshAccessToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.REFRESH_KEY, (err, user) => {
      if(err){
        return reject("Invalid refresh token")
      }
      const newAccessToken = generateAccessToken({
        id: user.id,
      })
      resolve(newAccessToken)
    })
  })
}

const generateRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.REFRESH_KEY, (err, user) => {
      if(err) {
        return reject("Invalid refresh token");
      }
      const newRefreshtoken = signRefreshToken({
        id: user.id
      })
      resolve(newRefreshtoken);
    })
  })
};

module.exports = {
  refreshAccessToken,
  generateRefreshToken
}