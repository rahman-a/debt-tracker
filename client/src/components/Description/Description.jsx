import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const Description = ({ isDescribeOn, setIsDescribeOn, note }) => {
  const { t } = useTranslation()

  return (
    <Modal
      show={isDescribeOn}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header>
        <Modal.Title id='contained-modal-title-vcenter'>
          {t('note')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{note}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='danger' onClick={() => setIsDescribeOn(false)}>
          {t('close')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default Description
