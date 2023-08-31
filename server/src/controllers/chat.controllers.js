import User from '../models/users.model.js'

export const searchForUsers = async (req, res, next) => {
  const { name } = req.query
  const user = req.user

  const searchFilter = {
    $or: [
      { fullNameInEnglish: { $regex: name, $options: 'i' } },
      { fullNameInArabic: { $regex: name, $options: 'i' } },
    ],
    _id: { $ne: user._id },
  }

  try {
    // search for users not equal to the current user
    const users = await User.find({ ...searchFilter }).select(
      'fullNameInEnglish fullNameInArabic avatar username'
    )
    if (!users.length) {
      res.status(404)
      throw new Error('No users found')
    }

    res.status(200).json({
      success: true,
      users,
    })
  } catch (error) {
    next(error)
  }
}
