import React from 'react'
import { Form } from 'react-bootstrap'

const Country = ({ setInfo }) => {
  return (
    <Form>
      <Form.Group className='mb-3' controlId='formBasicEmail'>
        <Form.Label>Member Company</Form.Label>
        <Form.Control
          name='company'
          placeholder='company'
          size='lg'
          onChange={(e) => setInfo({ company: e.target.value })}
        />
      </Form.Group>
    </Form>
  )
}

export default Country
