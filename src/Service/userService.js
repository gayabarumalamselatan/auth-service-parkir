const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getUser  = async (params) => {
  try {
    const formattedParams = { ...params }

    if(formattedParams.id) {
      formattedParams.id = parseInt(formattedParams.id, 10)
    }
    const users = await prisma.user.findMany({
      where: {
        ...formattedParams, 
      },
      select: {
        id: true,
        name: true,
        role_id: true, 
      },
    });
    if (users.length === 0) {
      return { status: 404, message: 'User  not found' };
    }

    return users;  
  } catch (error) {
    console.error('Error fetching users:', error); 
    return {
      status: 500,
      message: 'Server error',
      serverMessage: error.message,
    };
  } finally {
    await prisma.$disconnect();
  }
};

const loginAuth = async (name, password) => {
  const user = await prisma.user.findUnique({
    where: {name: name}
  })

  if (user.length === 0) {
    return { success: false, message: 'User  not found' };
  }
 
  if(user.is_loggedIn === true){
    return { success: false, message: 'User Already logged in' };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (isPasswordValid) {
    await prisma.user.update({
      where: {id: user.id},
      data: {is_loggedIn: true}
    })
    return { 
      success: true, 
      message: 'Login successful', 
      id: user.id,
      name: user.name
    };
  } else {
    return { success: false, message: 'Incorrect password' };
  }
};

const logOut = async (userId) => {
  const checkUser = await prisma.user.findUnique({
    where: {id: userId}
  })

  if(checkUser.is_loggedIn === false){
    return { success: false, message: 'User already logged out' };
  }else{
    try {
      await prisma.user.update({
        where: {id: userId},
        data: {
          is_loggedIn: false
        }
      })
      return { success: true, message: 'user successfully logged out' };
    } catch (error) {
      return { success: false, message: 'user logout failed' };
    }
  }
}

const registUser = async (name, password, role_id) => {
  try {
    const user = await prisma.user.findFirst({
      where: {name: name}
    })
    if (user) {
      return { success: false, message: 'Username is taken' };
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          name: name,
          password: hashedPassword,
          role_id: role_id,
        }
      })

      return { success: true, message: 'User  registered successfully'};
    }
  } catch (error) {
    console.error('Error registering user:', error); 
    return { success: false, message: 'Error registering user' };
  } finally {
    await prisma.$disconnect();
  }
}

const updateUser = async (params) => {
  const getPassword = await prisma.user.findUnique({
    where: {id: params.id}
  })

  if (params.is_change_password === true) {
    try {
      const isPasswordValid = await bcrypt.compare(params.password, getPassword.password)
      const hashedPassword = await bcrypt.hash(params.new_password, 10)
      if(isPasswordValid){
        try {
          await prisma.user.update({
            where: { id: params.id },
            data: {
              name: params.name,
              password: hashedPassword,
              role_id: params.role_id
            }
          })
        } catch (error) {
          console.error(error)
          return {success: false, message: "Failed to update user"}
        }
        return {success: true, message: "success"}
      } else {
        return {success: false, message: "Password is not valid"}
      }
    } catch (error) {
      console.error(error)
      return {success: false, message: "Failed to update user"}
    }
  } else {
    try {
      await prisma.user.update({
        where: { id: params.id },
        data: {
          name: params.name,
          password: getPassword.password,
          role_id: params.role_id
        }
      })
      return { success: true, message: "User successfully updated"}
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, message: 'Failed to update user' };
    }
  }
}

const deleteUser = async (params) => {
  const user = await prisma.user.findUnique({
    where: { id: params.adminId }
  })
  console.log(params)
  const isPasswordValid = await bcrypt.compare(params.password, user.password)
  if(isPasswordValid){
    try { 
      await prisma.user.delete({
        where: {id: params.id}
      })
      return {success: true, message: "User successfully deleted."}
    } catch (error) {
      console.error(error)
      return {success: false, message: "Failed to delete user"}
    }
  }
}


module.exports = {
  loginAuth,
  registUser,
  logOut,
  getUser,
  updateUser,
  deleteUser
}