import React from 'react'
import style from './style.module.scss'
import { Modal, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const Preview = ({ previewSrc, setPreviewSrc }) => {
  const { t } = useTranslation()

  return (
    <Modal show={previewSrc} onHide={() => setPreviewSrc(null)} centered>
      <Modal.Header>
        <Modal.Title>{t('preview')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <figure className={style.document__preview}>
          <img style={{ width: '100%' }} src={previewSrc} alt='preview' />
        </figure>
      </Modal.Body>
      <Modal.Footer>
        <Button
          size='lg'
          variant='secondary'
          onClick={() => setPreviewSrc(null)}
        >
          {t('close')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default Preview
