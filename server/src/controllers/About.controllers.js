import Content from '../models/About.model.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const createContent = async (req, res, next) => {
  const { headline, link } = req.body
  try {
    const about = await Content.find({})
    if (about.length) {
      return res.sendStatus(204)
    }
    const newContent = new Content({ header: JSON.parse(headline) })
    link && (newContent.link = link)
    await newContent.save()

    res.status(201).json({
      code: 200,
      success: true,
      message: req.t('content_created'),
    })
  } catch (error) {
    next(error)
  }
}

export const getContent = async (req, res, next) => {
  try {
    const content = await Content.find({})
    if (!content.length) {
      res.status(404)
      throw new Error(req.t('no_content_found'))
    }
    res.status(200).json({
      code: 200,
      success: true,
      content: content[0],
    })
  } catch (error) {
    next(error)
  }
}

export const updateHeadline = async (req, res, next) => {
  const { id } = req.params
  const { headline, link } = req.body
  try {
    const newContent = await Content.findById(id)
    newContent.header = JSON.parse(headline)
    link && (newContent.link = link)
    const updatedContent = await newContent.save()
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

export const createAboutItem = async (req, res, next) => {
  const { id } = req.params

  try {
    const content = await Content.findById(id)

    const newItem = {}
    newItem.title = JSON.parse(req.body.title)
    newItem.body = JSON.parse(req.body.body)

    const isItemFound = content.items.find(
      (item) => item.title['en'] === newItem.title['en']
    )
    if (isItemFound) {
      res.status(400)
      throw new Error(req.t('item_already_exists'))
    }
    if (req.fileName) {
      newItem.image = req.fileName
    }
    content.items = [...content.items, newItem]
    const updateContent = await content.save()
    res.status(201).json({
      code: 200,
      success: true,
      message: req.t('item_created'),
      content: updateContent,
    })
  } catch (error) {
    next(error)
  }
}

export const updateAboutItem = async (req, res, next) => {
  const { id } = req.params
  const { title, body } = req.body
  try {
    const contents = await Content.find({})
    const content = contents[0]

    content.items = content.items.map((item) => {
      if (item._id.toString() === id) {
        item.title = JSON.parse(title)
        item.body = JSON.parse(body)
        if (req.fileName) {
          item.image &&
            fs.unlinkSync(
              path.resolve(__dirname, `../../uploads/${item.image}`)
            )
          item['image'] = req.fileName
        }
      }
      return item
    })

    const updatedContent = await content.save()
    res.status(200).json({
      code: 200,
      success: true,
      message: req.t('item_updated'),
      content: updatedContent,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteAboutItem = async (req, res, next) => {
  const { id } = req.params

  try {
    const contents = await Content.find({})
    const content = contents[0]
    content.items = content.items.filter(
      (item) => item._id.toString() !== id.toString()
    )
    const updateContent = await content.save()
    res.status(200).json({
      code: 200,
      success: true,
      message: req.t('item_deleted'),
      content: updateContent,
    })
  } catch (error) {
    next(error)
  }
}
