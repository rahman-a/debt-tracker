import React, { useState } from 'react'
import style from './style.module.scss'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

import {
  Slider,
  News,
  AboutCompany,
  ContactText,
  SocialNetWork,
  Video as VideoIcon,
} from '../../icons'
import {
  Slider as SliderComponent,
  QuickNews,
  FormText,
  AboutCompany as AboutComponent,
  SocialMedia,
  Video,
} from '../../components'

const Content = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const type = new URLSearchParams(location.search).get('type')
  const { t } = useTranslation()
  const lang = i18next.language

  const SelectedComponent = {
    slider: <SliderComponent />,
    news: <QuickNews />,
    about: <AboutComponent />,
    contact: <FormText />,
    social: <SocialMedia />,
    video: <Video />,
  }

  return (
    <>
      <div className={style.content}>
        <h1 className='main-header'> {t('content-management')} </h1>
        <div className={style.content__select}>
          <button
            className={type === 'slider' ? style.content__select_active : ''}
            onClick={() => navigate('/content?type=slider')}
          >
            <span
              style={{
                marginRight: lang === 'en' ? '1rem' : 'unset',
                marginLeft: lang === 'ar' ? '1rem' : 'unset',
              }}
            >
              <Slider />
            </span>
            {t('slider')}
          </button>

          <button
            className={type === 'about' ? style.content__select_active : ''}
            onClick={() => navigate('/content?type=about')}
          >
            <span
              style={{
                marginRight: lang === 'en' ? '1rem' : 'unset',
                marginLeft: lang === 'ar' ? '1rem' : 'unset',
              }}
            >
              <AboutCompany />
            </span>
            {t('about-company')}
          </button>
          <button
            className={type === 'news' ? style.content__select_active : ''}
            onClick={() => navigate('/content?type=news')}
          >
            <span
              style={{
                marginRight: lang === 'en' ? '1rem' : 'unset',
                marginLeft: lang === 'ar' ? '1rem' : 'unset',
              }}
            >
              <News />
            </span>
            {t('quick-news')}
          </button>
          <button
            className={type === 'contact' ? style.content__select_active : ''}
            onClick={() => navigate('/content?type=contact')}
          >
            <span
              style={{
                marginRight: lang === 'en' ? '1rem' : 'unset',
                marginLeft: lang === 'ar' ? '1rem' : 'unset',
              }}
            >
              <ContactText />
            </span>
            {t('form-text')}
          </button>
          <button
            className={type === 'video' ? style.content__select_active : ''}
            onClick={() => navigate('/content?type=video')}
          >
            <span
              style={{
                marginRight: lang === 'en' ? '1rem' : 'unset',
                marginLeft: lang === 'ar' ? '1rem' : 'unset',
              }}
            >
              <VideoIcon />
            </span>
            {t('video-section')}
          </button>
          <button
            className={type === 'social' ? style.content__select_active : ''}
            onClick={() => navigate('/content?type=social')}
          >
            <span
              style={{
                marginRight: lang === 'en' ? '1rem' : 'unset',
                marginLeft: lang === 'ar' ? '1rem' : 'unset',
              }}
            >
              <SocialNetWork />
            </span>
            {t('social-media')}
          </button>
        </div>
        <div className={style.content_body}>{SelectedComponent[type]}</div>
      </div>
    </>
  )
}

export default Content
