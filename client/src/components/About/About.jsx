import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import i18next, { t } from 'i18next'
import actions from '../../actions'
import { classes } from './classes'

const About = ({ aboutRef }) => {
  const [images, setImages] = useState([])
  const [lang, setLang] = useState(i18next.language)
  const { mode } = useSelector((state) => state.appearance)
  const { isLoading, aboutUs: content } = useSelector(
    (state) => state.getAboutUs
  )
  const dispatch = useDispatch()

  useEffect(() => {
    i18next.on('languageChanged', (lng) => {
      setLang(lng)
    })
  }, [lang])

  useEffect(() => {
    !content && dispatch(actions.content.getAboutUs())
  }, [])

  useEffect(() => {
    if (content) {
      const images = content.items.map((item) => item.image)
      setImages(images)
    }
  }, [content])

  return (
    <div className={classes.about(mode)} ref={aboutRef}>
      <div className={classes.header(lang, mode)}>
        <div className={style.about__header_text}>
          <h2>{t('about-us')}</h2>
          {content?.link && (
            <Link
              to={`/articles/${content.link}`}
              className={style.about__header_learn}
            >
              {t('learn-more')}
            </Link>
          )}
        </div>
        <p>{content?.header[lang]}</p>
      </div>
      <div className={style.about__content}>
        <ul className={style.about__list}>
          {content?.items.map((item, idx) => (
            <li className={classes.item(mode)} key={item._id}>
              <h2>{idx + 1}</h2>
              <h3>{item.title[lang]}</h3>
              <p>{item.body[lang]}</p>
            </li>
          ))}
        </ul>
        <div className={classes.images(lang)}>
          {images.length &&
            images.map((image, idx) => (
              <div key={image} className={classes.imagesItems(lang)}>
                <img src={`api/files/${image}`} alt='security' />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default About
