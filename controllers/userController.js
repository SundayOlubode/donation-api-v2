const appError = require('../utils/appError')
const Cache = require('../configs/redis')
const Users = require('../models/userModel')

exports.getAllUsers = async (req, res, next) => {
  try {

    let users;
    users = await Cache.get('allUsers')

    if (users) {
      users = JSON.parse(users)

      // RETURN RES
      return res.status(200).json({
        status: 'success',
        data: { donors: users }
      })
    }

    users = await Users.find().select('firstname lastname');

    await Cache.set('allUsers', JSON.stringify(users), { EX: 60 })

    return res.status(200).json({
      status: 'success',
      data: { donors: users }
    })

  } catch (error) {
    return next(new appError(error.message, error.statusCode))
  }
}