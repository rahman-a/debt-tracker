import React, { useEffect, useState, useRef } from 'react'
import style from './style.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { useNavigate } from 'react-router-dom'
import i18next from 'i18next'
import actions from '../../actions'
import { useTranslation } from 'react-i18next'
import { sliders as slidersData, titles } from './data'
import { ArrowDown } from '../../icons'
import Particles from './Particles'

const Carousel = ({ aboutRef }) => {
  const navigate = useNavigate()
  const { isLoading, sliders } = useSelector((state) => state.listSliders)
  const dispatch = useDispatch()
  const [currentSlider, setCurrentSlider] = useState(1)
  const [progress, setProgress] = useState(0)
  const progressTracker = useRef(null)
  const [slider, setSlider] = useState(null)
  const lang = i18next.language
  const { t } = useTranslation()

  const changeSlider = (value) => {
    setCurrentSlider(value)
    setSlider(slidersData[value - 1])
    setProgress(0)
  }

  useEffect(() => {
    if (slidersData) {
      console.log('slidersData: ', slidersData[0])
      setSlider(slidersData[0])
    }
  }, [slidersData])

  useEffect(() => {
    progressTracker.current = setInterval(() => {
      setProgress((prev) => prev + 0.5)
    }, 50)
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      setProgress(0)
      if (currentSlider === slidersData.length) {
        setCurrentSlider(1)
        setSlider(slidersData[0])
      } else {
        setCurrentSlider((prev) => prev + 1)
        setSlider(slidersData[currentSlider])
      }
    }
  }, [progress])

  useEffect(() => {
    !sliders?.length && dispatch(actions.content.listSliders())
  }, [])

  return (
    <>
      <div
        className={`${style.slider} ${lang === 'ar' ? style.slider_ar : ''}`}
      >
        <Particles />
        <div className={style.slider__content}>
          <div className={style.slider__text} ref={aboutRef}>
            <h1>{slider?.title[lang]}</h1>
            <p>{slider?.description[lang]}</p>
            <button>{t('learn-more')}</button>
          </div>
          <div className={style.slider__illustration}>
            <img src={`/api/files/${slider?.image}`} alt='slider' />
          </div>
        </div>
        <div className={style.slider__outline}>
          {titles.map((title, idx) => (
            <div
              key={title['en']}
              onClick={() => changeSlider(idx + 1)}
              className={`${style.slider__outline_segment} ${
                currentSlider === idx + 1 ? style.slider__outline_active : ''
              }`}
            >
              {title[lang]}
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
