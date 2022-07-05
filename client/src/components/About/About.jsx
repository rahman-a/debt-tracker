import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { Placeholder } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import i18next from 'i18next'
import actions from '../../actions'

const About = ({ aboutRef }) => {
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
      <div className={style.about__header}>
        <div className={style.about__header_text}>
          <h2>About Us</h2>
          <button className={style.about__header_learn}>Learn more</button>
        </div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur,
          quia!
        </p>
      </div>
      <div className={style.about__content}>
        <ul className={style.about__list}>
          <li className={style.about__item}>
            <h2>1</h2>
            <h3>Who we Are</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Error,
              voluptatibus?
            </p>
          </li>
          <li className={style.about__item}>
            <h2>2</h2>
            <h3>What Do We Do</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Error,
              voluptatibus?
            </p>
          </li>
          <li className={style.about__item}>
            <h2>3</h2>
            <h3>How Do We Help</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Error,
              voluptatibus?
            </p>
          </li>
          <li className={style.about__item}>
            <h2>4</h2>
            <h3>Create Success Story</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Error,
              voluptatibus?
            </p>
          </li>
        </ul>
        <div className={style.about__images}>
          <div className={style.about__images_item}>
            <img src='/images/carousel/slide-1.jpg' alt='security' />
          </div>
          <div className={style.about__images_item}>
            <img src='/images/carousel/slide-2.png' alt='security' />
          </div>
          <div className={style.about__images_item}>
            <img src='/images/carousel/slide-3.jpg' alt='security' />
          </div>
          <div className={style.about__images_item}>
            <img src='/images/carousel/slide-4.jpeg' alt='security' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
