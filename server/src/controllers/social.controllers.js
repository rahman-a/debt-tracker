import Social from '../models/social.model.js'

export const createSocial = async (req, res, next) => {
  const { name } = req.body

  try {
    if (!name) {
      return res.status(400).json({
        message: req.t('provide_social_name'),
      })
    }
    const isFound = await Social.findOne({ name: name })
    if (isFound) {
      return res.status(400).json({
        message: req.t('social_platform_exist'),
      })
    }
    const social = await Social.create(req.body)
    res.status(201).json({
      message: req.t('social_platform_created'),
      social,
      code: 201,
      success: true,
    })
  } catch (error) {
    next(error)
  }
}

export const listSocial = async (req, res, next) => {
  try {
    const socials = await Social.find()
    res.status(200).json({
      socials,
      code: 200,
      success: true,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteSocial = async (req, res, next) => {
  try {
    const { id } = req.params
    const social = await Social.findById(id)
    if (!social) {
      return res.status(404).json({
        message: req.t('no_social_platforms_found'),
      })
    }
    await social.remove()

    res.status(200).json({
      message: req.t('social_platform_deleted'),
      social,
      code: 200,
      success: true,
    })
  } catch (error) {
    next(error)
  }
}
