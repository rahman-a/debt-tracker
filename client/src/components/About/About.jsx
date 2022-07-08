import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { Placeholder } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import i18next, { t } from 'i18next'
import actions from '../../actions'
import data from './data'

const About = ({ aboutRef }) => {
  const [images, setImages] = useState([])
  const [lang, setLang] = useState(i18next.language)
  const { isLoading, aboutUs } = useSelector((state) => state.getAboutUs)
  const dispatch = useDispatch()

  useEffect(() => {
    i18next.on('languageChanged', (lng) => {
      setLang(lng)
    })
  }, [lang])

  useEffect(() => {
    !aboutUs && dispatch(actions.content.getAboutUs())
  }, [])

  return (
    <div className={style.about} ref={aboutRef}>
      <div
        className={`${style.about__header} ${
          lang === 'ar' ? style.about__header_ar : ''
        }`}
      >
        <div className={style.about__header_text}>
          <h2>{t('about-us')}</h2>
          <button className={style.about__header_learn}>
            {t('learn-more')}
          </button>
        </div>
        <p>{data.header[lang]}</p>
      </div>
      <div className={style.about__content}>
        <ul className={style.about__list}>
          {data.items.map((item, idx) => (
            <li className={style.about__item} key={item.key}>
              <h2>{idx + 1}</h2>
              <h3>{item.title[lang]}</h3>
              <p>{item.body[lang]}</p>
            </li>
          ))}
        </ul>
        <div
          className={`${style.about__images} ${
            lang === 'ar' ? style.about__images_ar : ''
          }`}
        >
          <div
            className={`${style.about__images_item} ${
              lang === 'ar' ? style.about__images_item_ar : ''
            }`}
          >
            <img src='/images/carousel/slide-1.jpg' alt='security' />
          </div>
          <div
            className={`${style.about__images_item} ${
              lang === 'ar' ? style.about__images_item_ar : ''
            }`}
          >
            <img src='/images/carousel/slide-2.png' alt='security' />
          </div>
          <div
            className={`${style.about__images_item} ${
              lang === 'ar' ? style.about__images_item_ar : ''
            }`}
          >
            <img src='/images/carousel/slide-3.jpg' alt='security' />
          </div>
          <div
            className={`${style.about__images_item} ${
              lang === 'ar' ? style.about__images_item_ar : ''
            }`}
          >
            <img src='/images/carousel/slide-4.jpeg' alt='security' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
