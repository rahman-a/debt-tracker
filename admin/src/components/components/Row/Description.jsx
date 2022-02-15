import React from 'react'
import {Modal, Button} from 'react-bootstrap'

const Description = ({isDescribeOn, setIsDescribeOn, note}) => {
    return (
        <Modal
            show={isDescribeOn}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Operation Description
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                   {note}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='danger' onClick={() => setIsDescribeOn(false)}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Description
