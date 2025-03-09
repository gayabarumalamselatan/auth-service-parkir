const userService = require('../Service/userService')

const getUser = async (req, res) => {
  try {
    const data = await userService.getUser(req.query);
    res.json(data)
    console.log(data)
  } catch (error) {
    res.status(500).json({
      message: 'server error',
      serverMessage: error
    })
  }
}

const loginAuth = async (req, res) => {
  const { name, password } = req.body;

  // Check if username and password are provided
  if (!name || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const result = await userService.loginAuth(name, password)
    console.log(result)
    if (!result.success) {
      return res.status(401).json({ message: result.message });
    }
    console.log(result)
    return res.status(200).json({ message: result.message, userId: result.id, userName: result.name });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const logOut = async (req, res) => {
  const {userId} = req.body;
  if(!userId){
    return res.status(400).json({ message: 'userId are required' });
  }
  try {
    const result = await userService.logOut(userId)
    console.log(result)
    if (!result.success) {
      return res.status(401).json({ message: result.message });
    }
    console.log(result)
    return res.status(200).json({ message: result.message });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const registUser = async (req, res) => {
  const {name, password, role_id} = req.body;
  
  try {
    const result = await userService.registUser(name, password, role_id)
    console.log(result)
    if (!result.success) {
      return res.status(401).json({ message: result.message });
    }
    console.log(result)
    return res.status(200).json({ message: result.message });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const updateUser = async (req, res) => {
  try {
    console.log(req.body)
    const result = await userService.updateUser(req.body)
    if (!result.success) {
      return res.status(401).json({ message: result.message });
    }else if(result.success === true){
      return res.status(200).json({ message: result.message });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const deleteUser = async (req, res) => {
  try {
    console.log('asd',req)
    const result = await userService.deleteUser(req.body)
    if (!result.success) {
      return res.status(401).json({ message: result.message });
    }else if(result.success === true){
      return res.status(200).json({ message: result.message });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getUser,
  loginAuth,
  registUser,
  logOut,
  updateUser,
  deleteUser
}