import Slider from '../models/slider.model.js'
import Content from '../models/content.model.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const createSlider = async (req, res, next) => {
  const { englishTitle, arabicTitle, englishText, arabicText, article } =
    req.body

  const newSlider = new Slider({
    title: {
      en: englishTitle,
      ar: arabicTitle,
    },
    text: {
      en: englishText,
      ar: arabicText,
    },
  })

  try {
    if (article) {
      newSlider.article = article
    }

    if (req.fileName) {
      newSlider.image = req.fileName
    }

    const slider = await newSlider.save()

    res.status(201).json({
      code: 200,
      success: true,
      message: req.t('slider_created'),
      slider,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteSlider = async (req, res, next) => {
  try {
    const slider = await Slider.findById(req.params.id)
    if (!slider) {
      throw new Error(req.t('no_sliders_found'))
    }

    slider.image &&
      fs.unlinkSync(path.resolve(__dirname, `../../uploads/${slider.image}`))

    await slider.remove()

    res.status(200).json({
      code: 200,
      success: true,
      message: req.t('slider_deleted'),
    })
  } catch (error) {
    next(error)
  }
}

export const updateSlider = async (req, res, next) => {
  const { id } = req.params
  const { title, text } = req.body
  const updateData = {
    title: JSON.parse(title),
    text: JSON.parse(text),
  }

  if (req.body.article) {
    updateData.article = req.body.article
  }

  try {
    const slider = await Slider.findById(id)
    if (!slider) {
      res.status(404)
      throw new Error(req.t('no_sliders_found'))
    }
    for (let key in updateData) {
      slider[key] = updateData[key]
    }
    if (req.fileName) {
      slider.image &&
        fs.unlinkSync(path.resolve(__dirname, `../../uploads/${slider.image}`))
      slider.image = req.fileName
    }
    const updatedSlider = await slider.save()
    res.status(200).json({
      code: 200,
      success: true,
      message: req.t('slider_updated'),
      slider: updatedSlider,
    })
  } catch (error) {
    next(error)
  }
}

export const listSliders = async (req, res, next) => {
  try {
    const sliders = await Slider.find({}).populate('article', 'title')

    res.status(200).json({
      code: 200,
      success: true,
      sliders,
    })
  } catch (error) {
    next(error)
  }
}

export const createContent = async (req, res, next) => {
  const { type, name, body } = req.body
  let newContent = null

  if (type === 'news') {
    newContent = new Content(req.body)
    newContent.body = JSON.parse(body)
    if (name) {
      newContent.name = JSON.parse(name)
    }
  } else {
    newContent = new Content(req.body)
  }

  if (req.fileName) {
    newContent.image = req.fileName
  }

  try {
    const content = await newContent.save()

    res.status(201).json({
      code: 200,
      success: true,
      message: req.t('content_created'),
      content,
    })
  } catch (error) {
    next(error)
  }
}

export const updateContent = async (req, res, next) => {
  const { id } = req.params
  const { type } = req.body
  const updateData = req.body

  try {
    const content = await Content.findById(id)
    if (!content) {
      res.status(404)
      throw new Error(req.t('no_content_found'))
    }
    if (type === 'news') {
      for (let key in updateData) {
        key !== 'type' && (content[key] = JSON.parse(updateData[key]))
      }
    } else {
      for (let key in updateData) {
        content[key] = updateData[key]
      }
    }
    if (req.fileName) {
      content.image &&
        fs.unlinkSync(path.resolve(__dirname, `../../uploads/${content.image}`))
      content.image = req.fileName
    }
    const updatedContent = await content.save()
    res.status(200).json({
      code: 200,
      success: true,
      message: req.t('content_updated'),
      content: updatedContent,
    })
  } catch (error) {
    next(error)
  }
}

export const getContent = async (req, res, next) => {
  const { type } = req.query

  try {
    const content = await Content.findOne({ type })
    res.status(200).json({
      code: 200,
      success: true,
      content,
    })
  } catch (error) {
    next(error)
  }
}

export const listAllNewsContent = async (req, res, next) => {
  try {
    const news = await Content.find({ type: 'news' })
    res.status(200).json({
      code: 200,
      success: true,
      news,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteContent = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id)
    if (!content) {
      res.status(404)
      throw new Error(req.t('no_content_found'))
    }
    content.image &&
      fs.unlinkSync(path.resolve(__dirname, `../../uploads/${content.image}`))

    await content.remove()

    res.status(200).json({
      code: 200,
      success: true,
      message: req.t('content_deleted'),
    })
  } catch (error) {
    next(error)
  }
}
