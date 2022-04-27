import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const Note = ({ isNoteOn, setIsNoteOn, note, title }) => {
  const { t } = useTranslation()
  return (
    <Modal
      show={isNoteOn}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header>
        <Modal.Title id='contained-modal-title-vcenter'>{t(title)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{note}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='danger' onClick={() => setIsNoteOn(false)}>
          {t('close')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

Note.defaultProps = {
  title: 'note',
}

export default Note
