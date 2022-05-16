import Article from '../models/Article.model.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Create a new article
export const createArticle = async (req, res, next) => {
  try {
    const parsedTitle = JSON.parse(req.body['title'])
    const parsedBody = JSON.parse(req.body['body'])
    const data = { title: parsedTitle, body: parsedBody }

    const isTitleEnglishExist = await Article.findOne({
      'title.en': parsedTitle['en'],
    })

    if (isTitleEnglishExist) {
      return res.status(400).json({
        message: req.t('article_exist'),
      })
    }

    const isTitleArabicExist = await Article.findOne({
      'title.ar': parsedTitle['ar'],
    })

    if (isTitleArabicExist) {
      return res.status(400).json({
        message: req.t('article_exist'),
      })
    }

    if (req.fileName) {
      data.image = req.fileName
    }

    const article = await Article.create(data)

    res.status(201).json({
      message: req.t('article_created'),
      code: 201,
      success: true,
      article,
    })
  } catch (error) {
    next(error)
  }
}

// Get all articles
export const getArticles = async (req, res, next) => {
  const { title } = req.query
  try {
    let searchFilter = {}

    if (title) {
      searchFilter = {
        $or: [
          {
            'title.en': {
              $regex: new RegExp(title, 'i'),
            },
          },
          {
            'title.ar': {
              $regex: new RegExp(title, 'i'),
            },
          },
        ],
      }
    }

    const articles = await Article.find({ ...searchFilter })
    res.status(200).json({
      code: 200,
      success: true,
      articles,
    })
  } catch (error) {
    next(error)
  }
}

// Get a single article
export const getArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id)
    res.status(200).json({
      code: 200,
      success: true,
      article,
    })
  } catch (error) {
    next(error)
  }
}

// Update a single article
export const updateArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id)

    if (Object.keys(req.body).length > 0) {
      for (let key in req.body) {
        article[key] = JSON.parse(req.body[key])
      }
    }

    if (req.fileName) {
      fs.unlinkSync(path.resolve(__dirname, `../../uploads/${article.image}`))
      article.image = req.fileName
    }

    const updatedArticle = await article.save()

    res.status(200).json({
      code: 200,
      success: true,
      message: req.t('article_updated'),
      article: updatedArticle,
    })
  } catch (error) {
    next(error)
  }
}

// Delete a single article
export const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id)

    await article.remove()

    res.status(200).json({
      code: 200,
      success: true,
      message: req.t('article_deleted'),
    })
  } catch (error) {
    next(error)
  }
}

// increase article views
export const increaseArticleViews = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id)
    article.views++
    await article.save()
    res.status(200).json({
      code: 200,
      success: true,
    })
  } catch (error) {
    next(error)
  }
}
