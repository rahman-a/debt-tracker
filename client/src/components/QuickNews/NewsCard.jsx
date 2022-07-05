import React from 'react'
import style from './style.module.scss'
import Scrollbar from 'simplebar-react'

const NewsCard = () => {
  return (
    <div className={style.card}>
      <div className={style.card__container}>
        <div className={style.card__front}>
          <img src='/images/support-min.png' alt='support' />
          <h3>Lorem ipsum dolor sit amet.</h3>
        </div>
        <div className={style.card__back}>
          <img src='/images/swtle-bg.png' alt='background-logo' />
          <Scrollbar className={style.card__content}>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deleniti
              perspiciatis voluptate aliquid reiciendis ipsum placeat veniam
              dolorum obcaecati! Fugit et assumenda quaerat, quia illum facilis
              pariatur distinctio voluptatibus voluptate sed.
            </p>
          </Scrollbar>
          <h3>Lorem ipsum dolor sit amet.</h3>
        </div>
      </div>
    </div>
  )
}

export default NewsCard
