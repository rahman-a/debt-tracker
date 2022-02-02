import Currency from '../models/currencies.model.js'
import fs from 'fs'
import path from 'path'
import {fileURLToPath} from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url)) 

export const createCurrency = async(req, res, next) => {
    const newCurrency = new Currency({
        ...req.body,
        image:req.file.filename
    })
    console.log('image', req.file.filename);
    try {
        const isFound = await Currency.findOne({name:newCurrency.name})
        if(isFound) {
            fs.unlinkSync(path.resolve(__dirname, `../../uploads/${req.file.filename}`))
            res.status(400)
            throw new Error('The Currency Already Exist')
        }

        const currency = await newCurrency.save()
        res.status(201).send({
            success:true,
            code:201,
            id:currency._id,
            message:'New Currency has been Created'
        })
    } catch (error) {
        next(error)
    }
}

export const listAllCurrency = async (req, res, next) => {
    try {
        const currencies = await Currency.find({})
        if(currencies.length === 0) {
            res.status(404)
            throw new Error('No Currencies Found')
        }
        res.send({
            success:true,
            code:200,
            currencies
        })
    } catch (error) {
        next(error)
    }
}

export const deleteCurrency = async (req, res, next) => {
    const {id} = req.params 
    try {
        const currency = await Currency.findById(id) 
        if(!currency) {
            res.status(404)
            throw new Error('No Currency Found')
        }
        await currency.remove()
        res.send({
            success:true,
            code:200,
            message:'Currency has been removed'
        })
    } catch (error) {
        next(error)
    }
}