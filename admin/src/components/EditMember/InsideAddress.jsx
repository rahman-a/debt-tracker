import React from 'react'
import { Form } from 'react-bootstrap'

const InsideAddress = ({ setInfo }) => {
  return (
    <Form>
      <Form.Group className='mb-3' controlId='formBasicEmail'>
        <Form.Label>Address Inside UAE</Form.Label>
        <Form.Control
          name='insideAddress'
          placeholder='Address Inside UAE'
          size='lg'
          onChange={(e) => setInfo({ insideAddress: e.target.value })}
        />
      </Form.Group>
    </Form>
  )
}

export default InsideAddress
