const roleService = require('../Service/roleService')

const addRole = async (req, res) => {
  const { role_name } = req.body

  try {
    const result = await roleService.addRole(role_name)
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

const getRole = async (req, res) => {
  try {
    const data = await roleService.getRole(req.query)
    res.json(data)
  } catch (error) {
    res.status(500).json({
      message: 'server error',
      serverMessage: error
    })
  }
}

const updateRole = async (req, res) => {
  try {
    const result = await roleService.updateRole(req.body)
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

const deleteRole = async ( req, res ) => {
  const { id } = req.params
  try {
    const result = await roleService.deleteRole(parseInt(id))
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
  getRole,
  addRole,
  updateRole,
  deleteRole,
}