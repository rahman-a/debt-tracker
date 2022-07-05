import React, { useState } from 'react'
import style from './style.module.scss'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import 'swiper/css'
import { sliders, titles } from './data'
import { ArrowDown } from '../../icons'

const Test = () => {
  const [currentSlider, setCurrentSlider] = useState(1)
  const [progress, setProgress] = useState(0)
  const progressTracker = useRef(null)
  const [slider, setSlider] = useState(null)
  const swiper = useSwiper()
  const lang = i18next.language
  const { t } = useTranslation()

  const changeSlider = (value) => {
    // swiper.slideTo(value)
    console.log('Swiper: ', swiper)
    // setCurrentSlider(value + 1)
    // setSlider(sliders[value - 1])
    // setProgress(0)
  }

  // useEffect(() => {
  //   if (sliders) {
  //     setSlider(sliders[0])
  //   }
  // }, [sliders])

  // useEffect(() => {
  //   progressTracker.current = setInterval(() => {
  //     setProgress((prev) => prev + 0.4)
  //   }, 40)
  // }, [])

  // useEffect(() => {
  //   if (progress >= 100) {
  //     setProgress(0)
  //     if (currentSlider === sliders.length) {
  //       setCurrentSlider(1)
  //       setSlider(sliders[0])
  //     } else {
  //       setCurrentSlider((prev) => prev + 1)
  //       setSlider(sliders[currentSlider])
  //     }
  //   }
  // }, [progress])

  return (
    <div style={{ minHeight: '50vh' }}>
      <div
        className={`${style.slider} ${lang === 'ar' ? style.slider_ar : ''}`}
      >
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          draggable={true}
          onSlideChange={() => console.log('slide change')}
          onSwiper={(swiper) => console.log(swiper)}
        >
          {sliders.map((slider, index) => (
            <SwiperSlide key={slider?._id}>
              <div className={style.slider__content}>
                <div className={style.slider__text}>
                  <h1>{slider.title}</h1>
                  <p>{slider.description}</p>
                  <button>Know more...</button>
                </div>
                <div className={style.slider__illustration}>
                  <img src={`/api/files/${slider.image}`} alt='slider' />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className={style.slider__outline}>
          {titles.map((title, idx) => (
            <div
              key={title}
              onClick={() => changeSlider(idx)}
              className={`${style.slider__outline_segment} ${
                currentSlider === idx + 1 ? style.slider__outline_active : ''
              }`}
            >
              {title}
            </div>
          ))}
          <div
            className={style.slider__outline_progress}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className={style.slider__tap}>
          <ArrowDown />
        </div>
      </div>
    </div>
  )
}
export default Test
