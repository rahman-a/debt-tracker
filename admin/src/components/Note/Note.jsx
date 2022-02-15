import React from 'react'
import {Modal, Button} from 'react-bootstrap'

const Note = ({isNoteOn, setIsNoteOn, note}) => {
    return (
        <Modal
            show={isNoteOn}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Operation Note
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                   {note}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='danger' onClick={() => setIsNoteOn(false)}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Note
