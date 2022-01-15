import React from 'react'
import {Modal, Button} from 'react-bootstrap'

const Description = ({isDescribeOn, setIsDescribeOn}) => {
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
                    Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                    dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
                    consectetur ac, vestibulum at eros.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='danger' onClick={() => setIsDescribeOn(false)}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Description
