import React, { useState } from 'react'
import style from './style.module.scss'
import { Modal, Button } from 'react-bootstrap'
import { Play } from '../../icons'

const Video = () => {
  const [show, setShow] = useState(false)
  const watchVideoHandler = () => {
    setShow(true)
  }
  return (
    <>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Body>
          <div className={style.video__frame}>
            <iframe
              width='100%'
              height='315'
              src='https://www.youtube.com/embed/5hhwr2QU4Ck'
              title='YouTube video player'
              frameBorder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            ></iframe>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button size='lg' variant='secondary' onClick={() => setShow(false)}>
            Close
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
          <div className={style.video__content}>
            <h3>Lorem ipsum dolor sit amet consectetur</h3>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Excepturi provident quae, voluptatum quaerat earum suscipit
              numquam. Voluptatum harum, in sit ducimus atque dolore distinctio
              laborum corrupti dicta natus eius saepe nulla molestias
              consectetur nisi et.
            </p>
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
