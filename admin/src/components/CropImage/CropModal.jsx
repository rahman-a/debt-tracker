import React from 'react'
import style from './style.module.scss'
import { Modal, Button } from 'react-bootstrap'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import CropImage from './CropImage'
import { Camera } from '@/src/icons'

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
  const cropTitleClasses = classnames(style.crop__title, {
    [style.crop__title_ar]: lang === 'ar',
  })
  const cropContainerClasses = classnames(style.crop__container, {
    [style.crop__container_ar]: lang === 'ar',
  })
  return (
    <Modal show={isCropPhoto} centered>
      <Modal.Header>
        <Modal.Title>
          <p
            className={cropTitleClasses}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Camera />
            <span>{t(title)}</span>
          </p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={cropContainerClasses}>
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
