import React, { useEffect, useState, useRef } from 'react'
import style from './style.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import i18next, { t } from 'i18next'
import actions from '../../actions'
import Card from './NewsCard'
import { ArrowLeft, ArrowRight } from '../../icons'

const QuickNews = () => {
  const [lang, setLang] = useState(i18next.language)
  const { news } = useSelector((state) => state.listNews)
  const dispatch = useDispatch()
  const containerRef = useRef(null)

  const sliderMoveHandler = (type) => {
    const container = containerRef.current
    const containerDimension = container.getBoundingClientRect()
    const width = containerDimension.width
    type === 'prev'
      ? (container.scrollLeft += width)
      : (container.scrollLeft -= width)
  }

  useEffect(() => {
    i18next.on('languageChanged', (lng) => {
      setLang(lng)
    })
  }, [lang])

  useEffect(() => {
    dispatch(actions.content.listNews())
  }, [])

  return (
    <div className={style.news}>
      <h2>{t('quick-news')}</h2>
      <button
        onClick={() => sliderMoveHandler('next')}
        className={`${style.news__btn} ${style.news__nxtBtn}`}
      >
        <ArrowLeft />
      </button>
      <button
        onClick={() => sliderMoveHandler('prev')}
        className={`${style.news__btn} ${style.news__preBtn}`}
      >
        <ArrowRight />
      </button>
      <div className={style.news__container} ref={containerRef}>
        <div
          className={`${style.news__cards} ${true && style.news__cards_center}`}
        >
          {news?.length &&
            news.map((card) => <Card key={card.id} card={card} />)}
        </div>
      </div>
    </div>
  )
}

export default QuickNews
