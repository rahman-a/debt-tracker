import React from 'react'
import style from './style.module.scss'
import { Modal, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const SlideImage = ({ isImage, setIsImage, image }) => {
  const { t } = useTranslation()
  return (
    <Modal show={isImage} onHide={() => setIsImage(false)}>
      <Modal.Header>
        <Modal.Title> {t('slider-image')} </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={style.panel__image}>
          <img
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            src={`/api/files/${image}`}
            alt='slider'
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          style={{ marginRight: '2rem' }}
          variant='secondary'
          size='lg'
          onClick={() => setIsImage(false)}
        >
          {t('close')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default SlideImage
