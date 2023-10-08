import Currency from '../models/currencies.model.js'
import fs from 'fs'
import path from 'path'
const __dirname = path.join(process.cwd(), 'server/src/controllers')

export const createCurrency = async (req, res, next) => {
  const newCurrency = new Currency({
    ...req.body,
    image: req.file.filename,
  })
  try {
    const isFound = await Currency.findOne({ name: newCurrency.name })
    if (isFound) {
      fs.unlinkSync(
        path.resolve(__dirname, `../../uploads/${req.file.filename}`)
      )
      res.status(400)
      throw new Error(req.t('currency_already_exist'))
    }

    const currency = await newCurrency.save()
    res.status(201).send({
      success: true,
      code: 201,
      id: currency._id,
      message: req.t('currency_created'),
    })
  } catch (error) {
    next(error)
  }
}

export const listAllCurrency = async (req, res, next) => {
  try {
    const currencies = await Currency.find({})
    if (currencies.length === 0) {
      res.status(404)
      throw new Error(req.t('no_currency_found'))
    }
    res.send({
      success: true,
      code: 200,
      currencies,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteCurrency = async (req, res, next) => {
  const { id } = req.params
  try {
    const currency = await Currency.findById(id)
    if (!currency) {
      res.status(404)
      throw new Error(req.t('no_currency_found'))
    }
    await currency.remove()
    res.send({
      success: true,
      code: 200,
      message: req.t('currency_deleted'),
    })
  } catch (error) {
    next(error)
  }
}
