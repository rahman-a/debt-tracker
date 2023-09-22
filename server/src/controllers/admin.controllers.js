// @ts-nocheck
import User from '../models/users.model.js'
import Session from '../models/sessions.model.js'
import Operation from '../models/operations.model.js'
import Report from '../models/reports.model.js'
import Ticket from '../models/tickets.model.js'

export const login = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const staff = await User.AuthUser(email, password, res, req.t)
    if (!staff.roles.length) {
      res.status(401)
      throw new Error(req.t('not_authorized_to_access_dashboard'))
    }

    // create session document
    const session = new Session()
    // create authToken
    const data = {
      payload: { sessionId: session._id.toString() },
      secret: process.env.JWT_TOKEN,
    }
    const tokenExpiry = `7 days`
    const authToken = staff.generateToken(data, tokenExpiry)
    const expireDate = expireAt(7)
    // assign value to new session
    session.authToken = authToken
    session.expireAt = expireDate
    session.user = staff._id
    // save session
    await session.save()
    res.cookie('tkid', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    })
    const staffData = {
      _id: staff._id,
      fullNameInEnglish: staff.fullNameInEnglish,
      fullNameInArabic: staff.fullNameInArabic,
      avatar: staff.avatar,
      roles: staff.roles,
    }
    res.json({
      success: true,
      code: 200,
      staff: staffData,
      expiryAdAt: expireAt(7),
    })
  } catch (error) {
    next(error)
  }
}

// logout handler
export const logoutHandler = async (req, res, next) => {
  try {
    const sessionId = req.sessionId
    if (sessionId) {
      await Session.findByIdAndRemove(sessionId)
    }
    res.clearCookie('tkid')
    res.send({
      success: true,
      code: 200,
    })
  } catch (error) {
    next(error)
  }
}

export const createProviderAccount = async (req, res, next) => {
  const { username, country, emails, insidePhones, expiryAt } = req.body
  const newProvider = new User(req.body)

  try {
    let expire = null
    if (expiryAt) {
      expire = JSON.parse(expiryAt)
    }
    if (emails) {
      newProvider.emails = JSON.parse(emails)
    }
    if (insidePhones) {
      newProvider.insidePhones = JSON.parse(insidePhones)
    }

    const isUsernameFound = await User.findOne({ username })
    if (isUsernameFound) {
      res.status(400)
      throw new Error(req.t('username_already_found', { username }))
    }

    const primaryEmail = newProvider.emails.find(
      (email) => email.isPrimary === true
    )
    const isEmailFound = await User.findOne({
      'emails.email': primaryEmail.email,
    })
    if (isEmailFound) {
      res.status(400)
      throw new Error(
        req.t('email-already-exist', { email: primaryEmail.email })
      )
    }

    const primaryPhone = newProvider.insidePhones.find(
      (phone) => phone.isPrimary === true
    )
    const isPhoneFound = await User.findOne({
      'insidePhones.phone': primaryPhone.phone,
    })
    if (isPhoneFound) {
      res.status(400)
      throw new Error(
        req.t('phone_already_exist', { phone: primaryPhone.phone })
      )
    }
    if (req.files) {
      newProvider.avatar = req.files['avatar'][0].filename
      newProvider.passport = {
        image: req.files['passport'][0].filename,
        expireAt: expire['passport'],
      }
      newProvider.identity = {
        image: req.files['identity-front'][0].filename,
        back: req.files['identity-back'][0].filename,
        expireAt: expire['identity'],
      }
    }

    if (country) {
      newProvider.country = JSON.parse(country)
    }

    const code = createUserCode(
      newProvider.fullNameInEnglish,
      newProvider.country.name
    )
    newProvider['code'] = code.toLocaleUpperCase()

    await newProvider.save()

    res.send({
      success: true,
      code: 201,
      message: req.t('provider_account_created'),
    })
  } catch (error) {
    next(error)
  }
}

export const changeUserRole = async (req, res, next) => {
  const { id } = req.params
  const { role } = req.query
  const lang = req.headers['accept-language']
  const roles = {
    user: { en: 'Member', ar: 'عضو' },
    manager: { en: 'Panel Manager', ar: 'مدير' },
    cs: { en: 'Complains Administrator', ar: 'أخصائى شكاوى' },
    hr: { en: 'Members Administrator', ar: 'مختص شئون الإعضاء' },
  }

  try {
    if (!role) {
      res.status('400')
      throw new Error(req.t('define_role_first'))
    }
    const user = await User.findById(id)
    if (!user) {
      res.status(404)
      throw new Error(req.t('no_user_found'))
    }

    if (user.roles.includes('manager')) {
      res.status(400)
      throw new Error(req.t('cannot_change_role_of_manager'))
    }

    if (user.roles.includes(role)) {
      res.status(400)
      throw new Error(
        req.t('member_already_set_as', { role: roles[role][lang] })
      )
    }
    user.roles = role === 'user' ? [] : [role]

    await user.save()

    res.send({
      success: true,
      code: 200,
      message: req.t('user_has_set_as', { role: roles[role][lang] }),
    })
  } catch (error) {
    next(error)
  }
}

export const updateMemberData = async (req, res, next) => {
  const { id } = req.params
  const {
    englishName,
    arabicName,
    country,
    company,
    outsideAddress,
    insideAddress,
    phones,
  } = req.body
  try {
    let updatedData = {}
    const user = await User.findById(id)
    if (!user) {
      res.status(404)
      throw new Error(req.t('no_user_found'))
    }
    if (englishName) {
      user.fullNameInEnglish = englishName
      updatedData = { fullNameInEnglish: englishName }
    }
    if (arabicName) {
      user.fullNameInArabic = arabicName
      updatedData = { ...updatedData, fullNameInArabic: arabicName }
    }
    if (country) {
      user.country = JSON.parse(country)
      updatedData = { country: user.country }
    }

    if (phones) {
      user.outsidePhones = phones
      updatedData = { outsidePhones: phones }
    }
    if (insideAddress) {
      user.insideAddress = insideAddress
      updatedData = { insideAddress }
    }
    if (outsideAddress) {
      user.outsideAddress = outsideAddress
      updatedData = { outsideAddress }
    }
    if (company) {
      user.company = company
      updatedData = { company }
    }
    await user.save()
    res.send({
      success: true,
      code: 200,
      user: updatedData,
      message: req.t('member_data_updated'),
    })
  } catch (error) {
    next(error)
  }
}

export const mainDashboardInfo = async (req, res, next) => {
  try {
    const pendingOperationCount = await Operation.count({ state: 'pending' })
    const declinedOperationCount = await Operation.count({ state: 'decline' })
    const activeReportsCount = await Report.count({ isActive: true })
    const closedReportsCount = await Report.count({ isActive: false })
    const membersCount = await User.count({})
    const openedTicketsCount = await Ticket.count({ isOpen: true })

    res.send({
      success: true,
      code: 200,
      info: {
        pending: pendingOperationCount,
        declined: declinedOperationCount,
        active: activeReportsCount,
        closed: closedReportsCount,
        members: membersCount,
        tickets: openedTicketsCount,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const pendingOperationsAtLastWeek = async (req, res, next) => {
  try {
    const today = new Date()
    const lastWeek = new Date(new Date().setDate(new Date().getDate() - 7))

    const weekDayCount = {
      saturday: 0,
      sunday: 0,
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
    }

    const operations = await Operation.aggregate([
      {
        $match: {
          state: 'pending',
          createdAt: {
            $gte: lastWeek,
            $lte: today,
          },
        },
      },
      {
        $project: {
          _id: 0,
          day: { $dayOfWeek: '$createdAt' },
        },
      },
    ])

    operations.forEach(({ day }) => {
      if (day === 1) weekDayCount['sunday'] = +weekDayCount['sunday'] + 1
      if (day === 2) weekDayCount['monday'] = +weekDayCount['monday'] + 1
      if (day === 3) weekDayCount['tuesday'] = +weekDayCount['tuesday'] + 1
      if (day === 4) weekDayCount['wednesday'] = +weekDayCount['wednesday'] + 1
      if (day === 5) weekDayCount['thursday'] = +weekDayCount['thursday'] + 1
      if (day === 6) weekDayCount['friday'] = +weekDayCount['friday'] + 1
      if (day === 7) weekDayCount['saturday'] = +weekDayCount['saturday'] + 1
    })

    res.send({
      success: true,
      code: 200,
      operations: Object.values(weekDayCount),
    })
  } catch (error) {
    next(error)
  }
}

export const activeReportsAtLastWeek = async (req, res, next) => {
  try {
    const today = new Date()
    const lastWeek = new Date(new Date().setDate(new Date().getDate() - 7))

    const weekDayCount = {
      saturday: 0,
      sunday: 0,
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
    }

    const reports = await Report.aggregate([
      {
        $match: {
          isActive: true,
          createdAt: {
            $gte: lastWeek,
            $lte: today,
          },
        },
      },
      {
        $project: {
          _id: 0,
          day: { $dayOfWeek: '$createdAt' },
        },
      },
    ])

    reports.forEach(({ day }) => {
      if (day === 1) weekDayCount['sunday'] = +weekDayCount['sunday'] + 1
      if (day === 2) weekDayCount['monday'] = +weekDayCount['monday'] + 1
      if (day === 3) weekDayCount['tuesday'] = +weekDayCount['tuesday'] + 1
      if (day === 4) weekDayCount['wednesday'] = +weekDayCount['wednesday'] + 1
      if (day === 5) weekDayCount['thursday'] = +weekDayCount['thursday'] + 1
      if (day === 6) weekDayCount['friday'] = +weekDayCount['friday'] + 1
      if (day === 7) weekDayCount['saturday'] = +weekDayCount['saturday'] + 1
    })

    res.send({
      success: true,
      code: 200,
      reports: Object.values(weekDayCount),
    })
  } catch (error) {
    next(error)
  }
}

export const latestTenRegisteredMembers = async (req, res, next) => {
  try {
    const members = await User.find(
      {},
      {
        fullNameInEnglish: 1,
        fullNameInArabic: 1,
        createdAt: 1,
      }
    )
      .sort({ createdAt: -1 })
      .limit(10)

    res.send({
      success: true,
      code: 200,
      members,
    })
  } catch (error) {
    next(error)
  }
}

export const latestTenIssuedTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find(
      {},
      {
        title: 1,
        createdAt: 1,
      }
    )
      .sort({ createdAt: -1 })
      .limit(10)

    res.send({
      success: true,
      code: 200,
      tickets,
    })
  } catch (error) {
    next(error)
  }
}

// CREATE USER UNIQUE CODE
const createUserCode = (name, country) => {
  const randomNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const splittedName = name.split(' ')
  const firstNameLetter = splittedName[0][0]
  const lastNameLetter = splittedName[splittedName.length - 1][0]
  const countryFirstLetter = country[0]
  let codeNumber = ''
  for (let i = 0; i < 6; i++) {
    const num = randomNumbers[Math.floor(Math.random() * randomNumbers.length)]
    codeNumber += num
  }
  return firstNameLetter + lastNameLetter + countryFirstLetter + codeNumber
}

function expireAt(day) {
  const today = new Date()
  const expiry = new Date(today)
  return expiry.setDate(today.getDate() + day)
}
