import fs from 'fs'
import path from 'path'
import randomstring from 'randomstring'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { DateTime } from 'luxon'
import cron from 'node-cron'
import { fileURLToPath } from 'url'
import User from '../models/users.model.js'
import Operation from '../models/operations.model.js'
import Notification from '../models/notifications.model.js'
import sendSMS from '../sms/send.js'
import sendEmail from '../emails/email.js'
import { takeAction } from '../config/takeAction.js'
import { labels } from '../config/labels.js'
import { v4 as uuidv4 } from 'uuid'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const documentsInArabic = {
  identity: 'بطاقة الهوية',
  passport: 'جواز السفر',
  residential: 'بطاقة الأقامة',
}

// check if username, email, phone exist
export const checkIfExist = async (req, res, next) => {
  const { username, emails, phones } = req.body

  try {
    if (username) {
      const isUsernameFound = await User.findOne({ username })
      if (isUsernameFound) {
        res.status(400)
        throw new Error(req.t('username_already_found'))
      }
    }
    if (emails && emails.length) {
      for (const email of emails) {
        const isFound = await User.findOne({ 'emails.email': email.email })
        if (isFound) {
          res.status(400)
          throw new Error(req.t('email-already-exist', { email: email.email }))
        }
      }
    }
    if (phones && phones.length) {
      for (const phone of phones) {
        const isPhoneFound = await User.findOne({
          'insidePhones.phone': phone.phone,
        })
        if (isPhoneFound) {
          res.status(400)
          throw new Error(req.t('phone_already_exist', { phone: phone.phone }))
        }
      }
    }
    res.send({
      code: 200,
      success: true,
    })
  } catch (error) {
    next(error)
  }
}

export const registerNewUser = async (req, res, next) => {
  const { country, emails, insidePhones, outsidePhones } = req.body
  const user = req.body
  try {
    user.country = JSON.parse(country)
    user.emails = JSON.parse(emails)
    user.insidePhones = JSON.parse(insidePhones)
    outsidePhones && (user.outsidePhones = JSON.parse(outsidePhones))

    const code = createUserCode(
      user.fullNameInEnglish,
      user.country.name
    ).toLocaleUpperCase()
    user.code = code

    const expireAt = user.expireAt ? JSON.parse(user.expireAt) : null
    user['avatar'] = req.files['avatar'][0].filename
    user['verificationImage'] = req.files['verificationImage'][0].filename
    user['passport'] = {
      image: req.files['passport'][0].filename,
      expireAt: expireAt['passport'],
    }
    user['identity'] = {
      image: req.files['identity-front'][0].filename,
      back: req.files['identity-back'][0].filename,
      expireAt: expireAt['identity'],
    }
    console.log({ user })
    const newUser = new User(user)
    const savedUser = await newUser.save()
    const notification = {
      title: {
        en: 'New Registration',
        ar: 'تسجيل جديد',
      },
      body: {
        en: `${
          user.fullNameInEnglish
        } initiate new registration process with code #${code.toLocaleUpperCase()}#`,
        ar: `${
          user.fullNameInArabic
        } بدأ عملية تسجيل جديدة بكود رقم #${code.toLocaleUpperCase()}#`,
      },
    }

    await sendNotificationToAdminPanel(['manager', 'hr'], notification)
    await sendConfirmCodeToPhone(savedUser._id)

    res.status(201).send({
      code: 201,
      success: true,
      id: savedUser._id,
      message: req.t('user_created_successfully'),
    })
  } catch (error) {
    next(error)
  }
}

export const updateDocuments = async (req, res, next) => {
  const { id } = req.params
  const { type } = req.query

  try {
    const expireAt = JSON.parse(req.body.expireAt)
    console.log('expireAt: ', expireAt)

    const documentExpire = new Date(expireAt[type]).getTime()
    const now = new Date().getTime()

    if (now > documentExpire) {
      res.status(400)
      throw new Error('Document already Expired')
    }

    const user = await User.findById(id)

    if (user[type] && user[type]?.image) {
      const imagePath = path.join(
        __dirname,
        'server',
        '../../../uploads',
        user[type].image
      )
      fs.existsSync(imagePath) && fs.unlinkSync(imagePath)
      if (user[type]?.back) {
        const imagePath = path.join(
          __dirname,
          'server',
          '../../../uploads',
          user[type].back
        )
        fs.existsSync(imagePath) && fs.unlinkSync(imagePath)
      }
    }
    if (type === 'passport') {
      user['passport'] = {
        image: req.files['passport'][0].filename,
        expireAt: expireAt['passport'],
      }
    } else {
      user['identity'] = {
        image: req.files['identity-front'][0].filename,
        back: req.files['identity-back'][0].filename,
        expireAt: expireAt['identity'],
      }
    }

    let documentState = null

    if (type === 'identity') {
      documentState = user.colorCode.state.filter(
        (st) =>
          st.label['en'] !== labels['idExpired']['en'] &&
          st.label['en'] !== labels['idUpload']['en']
      )
    } else {
      documentState = user.colorCode.state.filter(
        (st) =>
          st.label['en'] !== labels['passExpired']['en'] &&
          st.label['en'] !== labels['passUpload']['en']
      )
    }

    user.colorCode.state = documentState

    let docObject = {}

    if (type === 'passport') {
      docObject = {
        image: req.files['passport'][0].filename,
        expireAt: expireAt['passport'],
        isExpired: false,
      }
    } else {
      docObject = {
        identityFront: {
          image: req.files['identity-front'][0].filename,
          expireAt: expireAt['identity'],
          isExpired: false,
        },
        identityBack: {
          image: req.files['identity-back'][0].filename,
          expireAt: expireAt['identity'],
          isExpired: false,
        },
      }
    }

    await takeAction(user._id, 'green')

    await user.save()

    const documents = {
      identity: {
        en: 'Identity',
        ar: 'الهوية',
      },
      passport: {
        en: 'Passport',
        ar: 'جواز السفر',
      },
      residential: {
        en: 'Residential',
        ar: 'الإقامة',
      },
    }

    const notification = {
      title: {
        en: 'Document Update',
        ar: 'تحديث مستندات الإثبات',
      },
      body: {
        en: `Member ${user.fullNameInEnglish} with code #${
          user.code
        }# has updated his ${
          documents[type]['en']
        } Document at ${new Date().toLocaleDateString()}`,
        ar: ` العضو ${user.fullNameInArabic} بكود #${
          user.code
        }# قام بتحديث مستند ${
          documents[type]['ar']
        } الخاص به بتاريخ ${new Date().toLocaleDateString()}`,
      },
    }

    await sendNotificationToAdminPanel(['manager', 'hr'], notification)

    res.send({
      success: true,
      doc: docObject,
      code: 200,
      isDone: true,
    })
  } catch (error) {
    next(error)
  }
}

// sent the code to user phone to verify the phone
export const sendConfirmCodeToPhoneHandler = async (req, res, next) => {
  const { id } = req.params
  const { email } = req.query

  try {
    if (!id && email) {
      await sendConfirmCodeToPhone(undefined, email)
    } else {
      await sendConfirmCodeToPhone(id)
    }
    res.send({
      success: true,
      code: 200,
      message: req.t('phone_code_sent'),
    })
  } catch (error) {
    next(error)
  }
}

// verify the user phone
export const verifyConfirmPhoneCodeHandler = async (req, res, next) => {
  const { id } = req.params
  const { code, email } = req.query
  try {
    let user
    if (!id && email) {
      user = await User.findOne({ 'emails.email': email })
    } else {
      user = await User.findById(id)
    }
    if (user.phoneCode !== code) {
      res.status(400)
      throw new Error(req.t('phone_code_not_valid'))
    }
    user.isPhoneConfirmed = true
    await user.save()
    id && !email && (await sendConfirmLinkToEmail(id, req))
    res.send({
      success: true,
      code: 200,
      message: req.t('phone_verification_success'),
    })
  } catch (error) {
    next(error)
  }
}

// send E-mail verification link to user E-mail
export const sendEmailVerificationLink = async (req, res, next) => {
  const { id } = req.params
  try {
    await sendConfirmLinkToEmail(id, req)
    res.send({
      success: true,
      code: 200,
      message: req.t('verification_link_sent_to_email'),
    })
  } catch (error) {
    next(error)
  }
}

// User Authentication using email and password
export const login = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const user = await User.AuthUser(email, password, res, req.t)
    res.send({
      success: true,
      code: 200,
      user: user._id,
      message: req.t('login_code_sent_to_email'),
    })
  } catch (error) {
    next(error)
  }
}

// logout handler
export const logoutHandler = async (req, res, next) => {
  try {
    res.clearCookie('token')
    res.send({
      success: true,
      code: 200,
    })
  } catch (error) {
    next(error)
  }
}

// send Password Reset Link to user Email
export const sendPasswordResetLink = async (req, res, next) => {
  const { email } = req.query
  try {
    const user = await User.findOne({ 'emails.email': email })

    if (!user) {
      res.status(404)
      throw new Error(req.t('email_not_connected_with_account'))
    }

    await sendAuthLink(user, req, 'reset')

    res.send({
      success: true,
      code: 200,
      message: req.t('pass_reset_link_sent_to_email'),
    })
  } catch (error) {
    next(error)
  }
}

// send login code
export const sendLoginCodeHandler = async (req, res, next) => {
  const { id } = req.params
  try {
    await sendLoginCodeToEmail(id)
    res.send({
      success: true,
      code: 200,
      message: req.t('login_code_sent_to_email'),
    })
  } catch (error) {
    next(error)
  }
}

// SEARCH FOR USERS BY [CODE - PHONE - USERNAME]

export const findUserHandler = async (req, res, next) => {
  const { code, mobile, username } = req.query
  try {
    let users

    if (mobile) {
      users = await User.find({
        'insidePhones.phone': mobile,
        _id: { $ne: req.user._id },
        isProvider: false,
      })
      if (users.length === 0) {
        res.status(404)
        throw new Error(req.t('no_user_found_search_again'))
      }
    } else {
      let searchFilter = {}

      if (code) {
        searchFilter = { code }
      }
      if (username) {
        searchFilter = { username }
      }

      users = await User.find({
        ...searchFilter,
        _id: { $ne: req.user._id },
        isProvider: false,
      })
      if (users.length === 0) {
        res.status(404)
        throw new Error(req.t('no_user_found_search_again'))
      }
    }
    const allUsers = users.map((user) => ({
      _id: user._id,
      name: user.fullNameInEnglish,
      arabicName: user.fullNameInArabic,
      image: user.avatar,
      color: user.colorCode.code,
    }))
    res.send({
      success: true,
      code: 200,
      users: allUsers,
    })
  } catch (error) {
    next(error)
  }
}

export const verifyAuthLink = async (req, res, next) => {
  const { token, type, password } = req.body
  try {
    // decode the token to extract user id
    const decode = jwt.verify(token, process.env.RESET_TOKEN, (err, decode) => {
      if (err) {
        console.log('err: ', err)
        throw new Error(req.t('link_invalid'))
      }
      return decode
    })
    // find the user using id from token
    const user = await User.findOne({ _id: decode.id })

    // if not user send error
    if (!user) throw new Error(req.t('no_user_found'))

    // check if reset code == the user reset code
    const isResetCodeMatch = await bcrypt.compare(decode.code, user.authString)

    // if not send error
    if (!isResetCodeMatch) throw new Error(req.t('link_invalid'))

    if (type === 'activate') {
      user.isEmailConfirmed = true
      await user.save()
      res.json({
        success: true,
        code: 200,
        message: req.t('email_verification_success'),
      })
    } else if (type === 'reset') {
      user.password = password
      await user.save()
      // send success from server
      res.json({
        success: true,
        code: 200,
        message: req.t('pass_reset_success'),
      })
    }
  } catch (error) {
    next(error)
  }
}

// verify the code that sent to email during every authentication
//  to add more security when authenticate user
export const verifyLoginCodeHandler = async (req, res, next) => {
  const { code, rememberDays } = req.body
  const { id } = req.params
  try {
    const user = await User.findById(id)
    if (user.emailCode !== code) {
      res.status(400)
      throw new Error(req.t('login_code_not_valid'))
    }
    if (!user.isEmailConfirmed) {
      user.isEmailConfirmed = true
      await user.save()
    }
    const userData = {
      _id: user._id,
      fullNameInEnglish: user.fullNameInEnglish,
      fullNameInArabic: user.fullNameInArabic,
      avatar: user.avatar,
      color: user.colorCode.code,
      isProvider: user.isProvider,
    }
    const tokenExpiry = rememberDays ? `${rememberDays} days` : '1d'
    const token = user.generateToken(tokenExpiry)
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * (rememberDays || 1),
    })
    res.json({
      success: true,
      code: 200,
      user: userData,
      expiryAt: expireAt(rememberDays || 1),
    })
  } catch (error) {
    next(error)
  }
}

// Send the user data
export const sendUserData = async (req, res, next) => {
  const { id } = req.params
  try {
    let user = null

    if (id) {
      if (
        req.user.roles.includes('manager') ||
        req.user.roles.includes('hr') ||
        req.user.roles.includes('cs')
      ) {
        const userData = await User.findById(id)
        user = { ...userData._doc }
      } else {
        res.status(401)
        throw new Error('Not Authorized to handle request')
      }
    } else {
      user = { ...req.user._doc }
    }

    if (user.identity) {
      const now = DateTime.now().ts
      const date = new Date(user.identity.expireAt)
      const expiry = DateTime.fromJSDate(date).ts

      user['identity-front'] = {
        _id: uuidv4(),
        image: user.identity.image,
        isExpired: now > expiry,
      }

      user['identity-back'] = {
        _id: uuidv4(),
        image: user.identity.back,
        isExpired: now > expiry,
      }

      delete user.identity
    }

    if (user.passport) {
      const now = DateTime.now().ts
      const date = new Date(user.passport.expireAt)
      const expiry = DateTime.fromJSDate(date).ts
      const passport = {
        _id: uuidv4(),
        image: user.passport.image,
        isExpired: now > expiry,
      }
      user.passport = passport
    }

    if (user.verificationImage) {
      user.snapshot = {
        _id: uuidv4(),
        image: user.verificationImage,
      }

      delete user.verificationImage
    }

    res.send({
      success: true,
      code: 200,
      user,
    })
  } catch (error) {
    next(error)
  }
}

export const updateUserPassword = async (req, res, next) => {
  const { password } = req.body
  try {
    req.user.password = password
    await req.user.save()
    res.send({
      success: true,
      code: 200,
      message: req.t('pass_update_success'),
    })
  } catch (error) {
    next(error)
  }
}

export const updateUserPreferredLanguage = async (req, res, next) => {
  const { lang } = req.query
  try {
    req.user.preferredLanguage = lang
    await req.user.save()

    res.send({
      code: 200,
      success: true,
      message: req.t('user_language_changed'),
    })
  } catch (error) {
    next(error)
  }
}

////////////////////////////////////////////////////
//////////////// Dashboard Routers
///////////////////////////////////////////////////

// LIST ALL USERS FOR ADMIN DASHBOARD
export const listAllUsers = async (req, res, next) => {
  const {
    skip,
    arabicName,
    englishName,
    code,
    username,
    color,
    isProvider,
    isActive,
    email,
    phone,
    country,
  } = req.query

  let searchFilter = {}

  try {
    if (code) {
      searchFilter = {
        ...searchFilter,
        code,
      }
    }
    if (arabicName) {
      searchFilter = {
        ...searchFilter,
        fullNameInArabic: {
          $regex: arabicName,
          $options: 'i',
        },
      }
    }
    if (englishName) {
      searchFilter = {
        ...searchFilter,
        fullNameInEnglish: {
          $regex: englishName,
          $options: 'i',
        },
      }
    }
    if (email) {
      searchFilter = {
        ...searchFilter,
        'emails.email': email,
      }
    }
    if (phone) {
      searchFilter = {
        ...searchFilter,
        'insidePhones.phone': phone,
      }
    }
    if (country) {
      searchFilter = {
        ...searchFilter,
        'country.name': {
          $regex: country,
          $options: 'i',
        },
      }
    }
    if (username) {
      searchFilter = {
        ...searchFilter,
        username,
      }
    }
    if (color) {
      searchFilter = {
        ...searchFilter,
        'colorCode.code': color,
      }
    }
    if (isProvider) {
      searchFilter = {
        ...searchFilter,
        isProvider: isProvider === 'true',
      }
    }

    if (isActive) {
      searchFilter = {
        ...searchFilter,
        isAccountConfirmed: isActive === 'true',
      }
    }

    const users = await User.find(
      { ...searchFilter },
      {
        code: 1,
        colorCode: 1,
        fullNameInEnglish: 1,
        fullNameInArabic: 1,
        createdAt: 1,
        avatar: 1,
        isAccountConfirmed: 1,
        isProvider: 1,
      }
    ).sort({ createdAt: -1 })

    if (!users.length) {
      res.status(404)
      throw new Error(req.t('no_users_found'))
    }

    const count = await User.count({ ...searchFilter })

    res.send({
      code: 200,
      success: true,
      users,
      count,
    })
  } catch (error) {
    next(error)
  }
}

// DELETE USER ROUTER
export const deleteUser = async (req, res, next) => {
  const { id } = req.params
  const lang = req.headers['accept-language']
  try {
    const user = await User.findById(id)
    if (!user) {
      res.status(404)
      throw new Error(req.t('no_user_found'))
    }
    await user.remove()

    const name = lang === 'ar' ? user.fullNameInArabic : user.fullNameInEnglish

    res.send({
      code: 200,
      success: true,
      message: req.t('user_deletion_success', { name }),
    })
  } catch (error) {
    next(error)
  }
}

// TOGGLE USER ACTIVATION

export const toggleUserActivation = async (req, res, next) => {
  const { id } = req.params

  try {
    const user = await User.findById(id)
    if (!user) {
      res.status(404)
      throw new Error(req.t('no_user_found'))
    }
    user.isAccountConfirmed = !user.isAccountConfirmed
    await user.save()

    res.send({
      success: true,
      code: 200,
      isConfirmed: user.isAccountConfirmed,
    })
  } catch (error) {
    next(error)
  }
}

export const changeUserColorCode = async (req, res, next) => {
  const { id } = req.params
  const { code, state } = req.body

  try {
    const user = await User.findById(id)

    if (!user) {
      res.status(404)
      throw new Error(req.t('no_user_found'))
    }

    if (code === '#037A12') {
      user.colorCode = {
        code,
        state: [],
      }
    } else {
      user.colorCode = {
        code,
        state: [...user.colorCode.state, state],
      }
    }

    await user.save()

    res.send({
      success: true,
      code: 200,
      message: req.t('color_code_change_success'),
    })
  } catch (error) {
    next(error)
  }
}

export const sendContactEmail = async (req, res, next) => {
  const { name, phone, email, message } = req.body

  try {
    if (!name) {
      res.status(400)
      throw new Error(req.t('name_is_required'))
    }
    if (!phone) {
      res.status(400)
      throw new Error(req.t('phone_is_required'))
    }
    if (!email) {
      res.status(400)
      throw new Error(req.t('email_is_required'))
    }
    if (!message) {
      res.status(400)
      throw new Error(req.t('message_is_required'))
    }

    const info = { name, message, phone, email }
    await sendEmail(info, 'contact', 'swtle.op@gmail.com')
    res.send({
      code: 200,
      success: true,
      message: req.t('contact_message_sent'),
    })
  } catch (error) {
    next(error)
  }
}

/*******************************************************************/
/******************** HELPER FUNCTION 
/******************************************************************/

///////////////////////////////////////////
/////////// PHONE VERIFICATION PROCESS
///////////////////////////////////////////
async function sendConfirmCodeToPhone(id, email) {
  try {
    let user
    if (!id && email) {
      user = await User.findOne({ 'emails.email': email })
    } else {
      user = await User.findById(id)
    }
    if (!user) {
      res.status(404)
      throw new Error(req.t('no_user_found'))
    }
    const phone = user.insidePhones.find(
      (phone) => phone.isPrimary === true
    ).phone
    const code = generateRandomCode(6)
    user.phoneCode = code
    await user.save()
    sendSMS(phone, code)
  } catch (error) {
    throw new Error(error)
  }
}

///////////////////////////////////////////
/////////// E-MAIL VERIFICATION PROCESS
///////////////////////////////////////////
async function sendConfirmLinkToEmail(id, req) {
  try {
    const user = await User.findById(id)
    await sendAuthLink(user, req, 'activate')
  } catch (error) {
    throw new Error(error)
  }
}

///////////////////////////////////////////
/////////// E-MAIL CODE PROCESS
///////////////////////////////////////////
async function sendLoginCodeToEmail(id) {
  try {
    const user = await User.findById(id)
    const code = generateRandomCode(7, 'string')
    user.emailCode = code
    await user.save()

    const info = {
      code: code,
      name: user.fullNameInEnglish,
      email: user.emails.find((email) => email.isPrimary === true).email,
    }
    await sendEmail(info, 'code')
  } catch (error) {
    throw new Error(error)
  }
}

async function sendAuthLink(user, req, type) {
  try {
    // create randomstring
    const resetCode = randomstring.generate()
    // create token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        code: resetCode,
      },
      process.env.RESET_TOKEN,
      { expiresIn: '1 day' }
    )

    // crypt this random string
    const cryptResetCode = await bcrypt.hash(resetCode, 10)
    // store in db
    user.authString = cryptResetCode
    await user.save()

    // compose the url
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/#/${type}?TOKEN=${token}`
    const info = {
      link: resetUrl,
      name: user.fullNameInEnglish,
      email: user.emails.find((email) => email.isPrimary === true).email,
    }
    await sendEmail(info, type)
  } catch (error) {
    throw new Error(error)
  }
}

const sendNotificationToAdminPanel = async (roles, data) => {
  try {
    const users = await User.find({ roles: { $in: roles } })
    const usersIds = users.map((user) => user._id)
    if (usersIds.length) {
      for (const id of usersIds) {
        data.user = id
        const newNotification = new Notification(data)
        await newNotification.save()
      }
    }
  } catch (error) {
    throw new Error(error)
  }
}

const generateRandomCode = (count, type) => {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const alphanumeric = [
    'A',
    0,
    'B',
    1,
    'C',
    2,
    'D',
    3,
    'E',
    4,
    'F',
    5,
    'G',
    6,
    'H',
    7,
    'I',
    8,
    'J',
    'K',
    'L',
    3,
    'M',
    'N',
    9,
    'O',
    'P',
    2,
    'Q',
    'R',
    1,
    'S',
    'T',
    'Y',
    0,
    'Z',
  ]
  let randomArray
  if (type === 'string') {
    randomArray = [...Array(count)].map((_) => {
      return alphanumeric[Math.ceil(Math.random() * (numbers.length - 1))]
    })
  } else {
    randomArray = [...Array(count)].map((_) => {
      return numbers[Math.ceil(Math.random() * (numbers.length - 1))]
    })
  }

  return randomArray.join('')
}

// CREATE USER UNIQUE CODE
const createUserCode = (name, country) => {
  console.log({ country })
  const randomNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const splittedName = name.split(' ')
  const firstNameLetter = splittedName[0][0]
  const lastNameLetter = splittedName[splittedName.length - 1][0]
  console.log({ country })
  const countryFirstLetter = country[0]
  let codeNumber = ''
  for (let i = 0; i < 6; i++) {
    const num = randomNumbers[Math.floor(Math.random() * randomNumbers.length)]
    codeNumber += num
  }
  return firstNameLetter + lastNameLetter + countryFirstLetter + codeNumber
}

const scanUserDocuments = async () => {
  let date = DateTime.now()
    .setZone('Africa/Cairo')
    .toLocaleString(DateTime.DATETIME_MED)
  console.log(`Start Users Scanning.... at ${date}`)
  try {
    const users = await User.find({})

    if (users.length) {
      for (const user of users) {
        if (user.identity && user.identity.expireAt) {
          await documentExpiredHandler(user._id, 'identity', 'idExpired')
        }

        if (user.passport && user.passport.expireAt) {
          await documentExpiredHandler(user._id, 'passport', 'passExpired')
        }
      }
    }

    date = DateTime.now()
      .setZone('Africa/Cairo')
      .toLocaleString(DateTime.DATETIME_MED)
    console.log(`Done Users Scanning!!!! at ${date}`)
  } catch (error) {
    date = DateTime.now()
      .setZone('Africa/Cairo')
      .toLocaleString(DateTime.DATETIME_MED)
    console.error(
      '\x1b[31m',
      `Done Users Scanning!!!! at ${date} with ERROR: ${error.message}`
    )
    console.log(error)
  }
}

const documentExpiredHandler = async (id, document, action) => {
  const user = await User.findById(id)

  const now = DateTime.now().setZone('Asia/Dubai').ts

  const expiryDateObject = new Date(user[document].expireAt)
  const expiryDate =
    DateTime.fromJSDate(expiryDateObject).setZone('Asia/Dubai').ts

  if (now > expiryDate) {
    await takeAction(user._id, 'yellow', action)
  } else {
    const now = DateTime.now().setZone('Asia/Dubai')

    const expiryDateObject = new Date(user[document].expireAt)
    const expiryDate =
      DateTime.fromJSDate(expiryDateObject).setZone('Asia/Dubai')

    const weekDiff = expiryDate.diff(now, ['days', 'hours'])
    const weekDiffInDays = weekDiff.values.days
    if (weekDiffInDays < 8 && weekDiffInDays > 6) {
      documentsInArabic
      const newNotification = {
        user: user._id,
        title: {
          en: `Your ${capitalize(document)} About to Expire`,
          ar: `صلاحية ${documentsInArabic[document]} على وشك الإنتهاء`,
        },
        body: {
          en: `We Remind you to upload your new ${document} because you only have less than a week
                    before your ${document} EXPIRE`,
          ar: `هذا إشعار تذكير برفع ${documentsInArabic[document]} جديد لأن تاريخ صلاحية المستند القديم على وشك الإنتهاء فى وقت أقل من أسبوع`,
        },
      }
      // sent notification to user
      const notification = new Notification(newNotification)
      await notification.save()

      const info = {
        name: user.fullNameInEnglish,
        type: capitalize(document),
        date: new Date(user[document].expireAt).toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        image: `https://www.swtle.com/api/files/${user[document].image}`,
      }

      // send email to inform the user
      await sendEmail(info, 'reminder')
    }
  }
}

function capitalize(string) {
  return string.charAt(0).toLocaleUpperCase() + string.slice(1)
}

function expireAt(day) {
  const today = new Date()
  const expiry = new Date(today)
  return expiry.setDate(today.getDate() + day)
}

cron.schedule('10 6 * * *', scanUserDocuments, {
  timezone: 'Asia/Dubai',
})
