const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  console.log(token)
  if (!token) {
    return res.sendStatus(403); 
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(401); 
    }
    req.user = user; 
    next(); 
  });
};

module.exports = authenticateJWT