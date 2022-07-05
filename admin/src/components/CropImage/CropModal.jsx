import React from 'react'
import style from './style.module.scss'
import { Modal, Button } from 'react-bootstrap'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { Camera } from '../../icons'
import CropImage from './CropImage'

const CropModal = ({
  isCropPhoto,
  defaultSrc,
  file,
  output,
  closePanel,
  title,
}) => {
  const lang = i18next.language
  const { t } = useTranslation()

  return (
    <Modal show={isCropPhoto} centered>
      <Modal.Header>
        <Modal.Title>
          <p
            className={`${style.crop__title} ${
              lang === 'ar' ? style.crop__title_ar : ''
            }`}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Camera />
            <span>{t(title)}</span>
          </p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          className={`${style.crop__container} ${
            lang === 'ar' ? style.crop__container_ar : ''
          }`}
        >
          <CropImage
            defaultSrc={defaultSrc}
            file={file}
            closePanel={closePanel}
            outputFile={(file) => output(file)}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button size='lg' variant='secondary' onClick={closePanel}>
          {t('close')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CropModal
