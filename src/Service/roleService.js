const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const addRole = async (roleName) => {
  console.log(roleName)
  const checkRoleAvailable = await prisma.role.findMany({
    where:{
      role_name: roleName
    }
  })
  console.log(checkRoleAvailable)
  console.log(roleName)
  if(checkRoleAvailable.length > 0){
    return { success: false, message: 'Role is already taken'}
  }else{
    await prisma.role.create({
      data: {
        role_name: roleName
      }
    })
    return { success: true, message: 'New role successfully added' }
  }
}

const getRole = async (params) => {
  const formattedParams = {...params}
  if(formattedParams.id){
    formattedParams.id = parseInt(formattedParams.id, 10)
  }

  try {
    const roleData = await prisma.role.findMany({
      where: {
        ...formattedParams
      }
    })
    return roleData 
  } catch (error) {
    console.error(error)
    throw error
  } finally {
    await prisma.$disconnect
  }
}

const updateRole = async (params) => {
  console.log(params.id)
  try {
    await prisma.role.update({
      where:{
        id: params.id
      },
      data: {
        role_name: params.role_name
      }
    })
    return { success: true, message: 'Role updated successfully' };
  } catch (error) {
    console.error('Error updating role:', error);
    return { success: false, message: 'Failed to update role' };
  }
}

const deleteRole = async (id) => {
  try {
    await prisma.role.delete({
      where: { id: id }
    })
    return { success: true, message: 'Role deleted successfully' }
  } catch (error) {
    console.error('Error deleting role:', error);
    return { success: false, message: 'Failed to delete role' };
  }
}

module.exports = {
  getRole,
  addRole,
  updateRole,
  deleteRole,
 
}