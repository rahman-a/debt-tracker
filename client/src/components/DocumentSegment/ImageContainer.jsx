// @ts-nocheck
import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import { Modal, Button, Badge } from 'react-bootstrap'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { Loader } from '@/src/components'

const ImageContainer = ({ img, document, setIsImage, isImage }) => {
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()
  const lang = i18next.language

  useEffect(() => {
    img && setIsLoading(false)
  }, [img])

  return (
    <Modal show={isImage} onHide={() => setIsImage(false)}>
      <Modal.Header>
        <Badge bg='dark'>
          {lang === 'ar'
            ? `${t('document')} ${t(document)}`
            : `${t(document)} ${t('document')}`}
        </Badge>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <Loader size='8' center options={{ animation: 'border' }} />
        ) : (
          <div className={style.segment__image}>
            <img src={img} alt={document} />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setIsImage(false)} variant='danger' size='lg'>
          {t('close')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ImageContainer
