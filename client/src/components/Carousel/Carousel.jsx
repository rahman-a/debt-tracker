import React, { useEffect, useState, useRef } from 'react'
import style from './style.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { useNavigate, Link } from 'react-router-dom'
import i18next from 'i18next'
import actions from '../../actions'
import { useTranslation } from 'react-i18next'
import { ArrowDown } from '../../icons'
import Particles from './Particles'

const Carousel = ({ aboutRef }) => {
  const navigate = useNavigate()
  const { isLoading, sliders } = useSelector((state) => state.listSliders)
  const dispatch = useDispatch()
  const [currentSlider, setCurrentSlider] = useState(1)
  const [keywords, setKeywords] = useState([])
  const [progress, setProgress] = useState(0)
  const progressTracker = useRef(null)
  const [slider, setSlider] = useState(null)
  const lang = i18next.language
  const { t } = useTranslation()

  const changeSlider = (value) => {
    setCurrentSlider(value)
    setSlider(sliders[value - 1])
    setProgress(0)
  }

  useEffect(() => {
    progressTracker.current = setInterval(() => {
      setProgress((prev) => prev + 0.5)
    }, 50)
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      setProgress(0)
      if (currentSlider === sliders.length) {
        setCurrentSlider(1)
        setSlider(sliders[0])
      } else {
        setCurrentSlider((prev) => prev + 1)
        setSlider(sliders[currentSlider])
      }
    }
  }, [progress])

  useEffect(() => {
    !sliders?.length && dispatch(actions.content.listSliders())
  }, [])

  useEffect(() => {
    if (sliders) {
      setKeywords(sliders.map((slider) => slider.keyword))
      setSlider(sliders[0])
    }
  }, [sliders])

  return (
    <>
      <div
        className={`${style.slider} ${lang === 'ar' ? style.slider_ar : ''}`}
      >
        <Particles />
        <div className={style.slider__content}>
          <div className={style.slider__text} ref={aboutRef}>
            <h1>{slider?.title[lang]}</h1>
            <p>{slider?.text[lang]}</p>
            {slider?.article && (
              <Link to={`/articles/${slider.article._id}`}>
                {t('learn-more')}
              </Link>
            )}
          </div>
          <div className={style.slider__illustration}>
            <img src={`/api/files/${slider?.image}`} alt='slider' />
          </div>
        </div>
        <div className={style.slider__outline}>
          {keywords.length &&
            keywords.map((keyword, idx) => (
              <div
                key={keyword['en']}
                onClick={() => changeSlider(idx + 1)}
                className={`${style.slider__outline_segment} ${
                  currentSlider === idx + 1 ? style.slider__outline_active : ''
                }`}
              >
                {keyword[lang]}
              </div>
            ))}
          <div
            className={style.slider__outline_progress}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div
          className={style.slider__tap}
          onClick={() => aboutRef.current.scrollIntoView()}
        >
          <ArrowDown />
        </div>
      </div>
    </>
  )
}

export default Carousel
