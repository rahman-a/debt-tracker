import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { Modal, Button } from 'react-bootstrap'
import { Play } from '../../icons'
import data from './data'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

const Video = () => {
  const [show, setShow] = useState(false)
  const [lang, setLang] = useState(i18next.language)

  const watchVideoHandler = () => {
    // setShow(true)
  }

  const { t } = useTranslation()

  useEffect(() => {
    i18next.on('languageChanged', (lng) => {
      setLang(lng)
    })
  }, [lang])

  return (
    <>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Body>
          <div className={style.video__frame}>
            <iframe
              width='100%'
              height='315'
              src={`https://www.youtube.com/embed/${data.video}`}
              title='YouTube video player'
              frameBorder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            ></iframe>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button size='lg' variant='secondary' onClick={() => setShow(false)}>
            {t('close')}
          </Button>
        </Modal.Footer>
      </Modal>
      <div className={style.video}>
        <button className={style.video__play} onClick={watchVideoHandler}>
          <span>
            <Play />
          </span>
        </button>
        <div className={style.video__container}>
          {/* <img src='/images/swtle-bg.png' alt='bg' /> */}
          <div
            className={`${style.video__content} ${
              lang === 'ar' ? style.video__content_ar : ''
            }`}
          >
            <h3>{data.header[lang]}</h3>
            <p>{data.body[lang]}</p>
          </div>
        </div>
        <figure>
          <img src='/images/contact-bg.jpg' alt='background' />
        </figure>
      </div>
    </>
  )
}

export default Video
