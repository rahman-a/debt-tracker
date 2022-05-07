import React from 'react'
import style from './style.module.scss'
import { useTranslation } from 'react-i18next'
import { FacebookShareButton, WhatsappShareButton } from 'react-share'
import { ProfileContainer } from '../../components'

const Social = () => {
  const { t } = useTranslation()
  return (
    <div className={style.profile__social}>
      <ProfileContainer title='social-media'>
        <div className={style.profile__social_wrapper}>
          <h3>{t('share-on')}</h3>
          <FacebookShareButton
            url='https://www.swtle.com/'
            className={style.profile__social_button}
          >
            {<img src='/images/facebook.png' alt='facebook' />}
          </FacebookShareButton>
          <WhatsappShareButton
            url='https://www.swtle.com/'
            className={style.profile__social_button}
          >
            <img src='/images/whatsapp.png' alt='whatsapp' />
          </WhatsappShareButton>
        </div>
      </ProfileContainer>
    </div>
  )
}

export default Social
