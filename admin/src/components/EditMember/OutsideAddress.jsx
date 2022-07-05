import React from 'react'
import { Form } from 'react-bootstrap'

const OutsideAddress = ({ setInfo }) => {
  return (
    <Form>
      <Form.Group className='mb-3' controlId='formBasicEmail'>
        <Form.Label>Address Outside UAE</Form.Label>
        <Form.Control
          name='outsideAddress'
          placeholder='Address Outside UAE'
          size='lg'
          onChange={(e) => setInfo({ outsideAddress: e.target.value })}
        />
      </Form.Group>
    </Form>
  )
}

export default OutsideAddress
