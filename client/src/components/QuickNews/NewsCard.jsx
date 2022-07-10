import React from 'react'
import style from './style.module.scss'
import Scrollbar from 'simplebar-react'
import i18next from 'i18next'

const NewsCard = ({ card }) => {
  const lang = i18next.language
  return (
    <div className={`${style.card} ${lang === 'ar' ? style.card_ar : ''}`}>
      <div className={style.card__container}>
        <div className={style.card__front}>
          <img src={`/api/files/${card.image}`} alt='support' />
          <h3>{card.name[lang]}</h3>
        </div>
        <div
          className={`${style.card__back} ${
            lang === 'ar' ? style.card__back_ar : ''
          }`}
        >
          <img src='/images/swtle-bg.png' alt='background-logo' />
          <Scrollbar className={style.card__content}>
            <p>{card.body[lang]}</p>
          </Scrollbar>
          <h3>{card.name[lang]}</h3>
        </div>
      </div>
    </div>
  )
}

export default NewsCard
