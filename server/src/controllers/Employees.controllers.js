import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Company from '../models/Company.model.js'
import User from '../models/users.model.js'
import { chatClient } from '../config/stream.chat.js'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const createEmployee = async (req, res, next) => {
  const { username, country, emails, insidePhones, company, expiryAt } =
    req.body
  const newEmployee = new User(req.body)

  try {
    let expire = {}
    if (expiryAt) {
      expire = JSON.parse(expiryAt)
    }
    if (emails) {
      newEmployee.emails = JSON.parse(emails)
    }
    if (insidePhones) {
      newEmployee.insidePhones = JSON.parse(insidePhones)
    }

    const isUsernameFound = await User.findOne({ username })
    if (isUsernameFound) {
      res.status(400)
      throw new Error(req.t('username_already_found', { username }))
    }

    const primaryEmail = newEmployee.emails.find(
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

    const primaryPhone = newEmployee.insidePhones.find(
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
      newEmployee.avatar = req.files['avatar'][0].filename
      newEmployee.passport = {
        image: req.files['passport'][0].filename,
        expireAt: expire['passport'],
      }
      newEmployee.identity = {
        image: req.files['identity-front'][0].filename,
        back: req.files['identity-back'][0].filename,
        expireAt: expire['identity'],
      }
    }

    if (country) {
      newEmployee.country = JSON.parse(country)
    }
    const parsedCompany = JSON.parse(company)
    if (company) {
      newEmployee.company = parsedCompany
    }

    const code = createUserCode(
      newEmployee.fullNameInEnglish,
      newEmployee.country.name
    )
    newEmployee['code'] = code.toLocaleUpperCase()

    const savedEmployee = await newEmployee.save()

    await Company.findByIdAndUpdate(parsedCompany.data, {
      $push: { employees: { employee: savedEmployee._id, isManager: false } },
    })

    await chatClient.upsertUser({
      id: savedEmployee._id,
      name: savedEmployee.fullNameInEnglish,
      role: 'user',
      arabicName: savedEmployee.fullNameInArabic,
      image: savedEmployee.avatar,
    })

    res.send({
      success: true,
      code: 201,
      message: req.t('employee_account_created'),
    })
  } catch (error) {
    next(error)
  }
}

export const listAllEmployees = async (req, res, next) => {
  const { manager } = req.params

  try {
    const company = await Company.findOne({ manager })
    if (!company) {
      res.status(404)
      throw new Error(req.t('not_associated_with_company'))
    }
    const employeesIds = company.employees.map((employee) => employee.employee)
    const employees = await User.find({ _id: { $in: employeesIds } })
    if (!employees || employees.length === 0) {
      res.status(404)
      throw new Error(req.t('no_employees_found'))
    }
    const employeesData = employees.map((employee) => {
      return {
        _id: employee._id,
        fullNameInEnglish: employee.fullNameInEnglish,
        fullNameInArabic: employee.fullNameInArabic,
        code: employee.code,
        status: employee.colorCode.code,
        avatar: employee.avatar,
        createdAt: employee.createdAt,
      }
    })
    res.send({
      success: true,
      employees: employeesData,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteEmployee = async (req, res, next) => {
  const { employeeId } = req.params
  try {
    const employee = await User.findById(employeeId)
    if (!employee) {
      res.status(404)
      throw new Error(req.t('employee_not_found'))
    }
    const company = await Company.findOne({ manager: req.user._id })
    if (!company) {
      res.status(404)
      throw new Error(req.t('not_associated_with_company'))
    }
    const isEmployeeFound = company.employees.find(
      (employee) => employee.employee.toString() === employeeId.toString()
    )
    if (!isEmployeeFound) {
      res.status(404)
      throw new Error(req.t('employee_not_associated_with_company'))
    }
    company.employees = company.employees.filter(
      (employee) => employee.employee.toString() !== employeeId.toString()
    )
    await company.save()
    await User.findByIdAndDelete(employeeId)
    res.send({
      success: true,
      message: req.t('employee_deleted'),
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
