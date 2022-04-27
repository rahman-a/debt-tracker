import React, { useEffect } from 'react'
import style from './style.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { Placeholder } from 'react-bootstrap'
import { Carousel as Slider } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { useNavigate } from 'react-router-dom'
import i18next from 'i18next'
import actions from '../../actions'
import { useTranslation } from 'react-i18next'

const Carousel = () => {
  const navigate = useNavigate()
  const { isLoading, sliders } = useSelector((state) => state.listSliders)
  const dispatch = useDispatch()
  const lang = i18next.language
  const { t } = useTranslation()
  useEffect(() => {
    !sliders?.length && dispatch(actions.content.listSliders())
  }, [])

  return (
    <Slider
      autoPlay
      infiniteLoop={true}
      swipeable={true}
      showStatus={false}
      showThumbs={false}
      className={style.carousel}
    >
      {isLoading ? (
        <div
          className={style.carousel__slide}
          style={{ height: 'calc(100vh - 10rem)' }}
        >
          <Placeholder as='p' bg='light' animation='wave' className='h-100'>
            <Placeholder xs={12} className='h-100' />
          </Placeholder>
        </div>
      ) : (
        sliders &&
        sliders.map((slide) => {
          return (
            <div className={style.carousel__slide} key={slide._id}>
              <img src={`/api/files/${slide.image}`} alt={slide.title} />
              <div
                className={style.carousel__desc}
                style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
              >
                <h2>{slide.title[lang]}</h2>
                <p style={{ flexDirection: lang === 'ar' && 'row-reverse' }}>
                  {slide.text[lang]}
                  {slide.article && (
                    <span
                      className={style.carousel__more}
                      onClick={() => navigate(`/articles/${slide.article._id}`)}
                    >
                      {' '}
                      {t('more')}{' '}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )
        })
      )}
    </Slider>
  )
}

export default Carousel
