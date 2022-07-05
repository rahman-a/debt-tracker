import React from 'react'
import { Form } from 'react-bootstrap'

const FullName = ({ setInfo, info }) => {
  return (
    <Form>
      <Form.Group className='mb-3' controlId='formBasicEmail'>
        <Form.Label>Full Name in English</Form.Label>
        <Form.Control
          name='englishName'
          placeholder='Full Name in English'
          size='lg'
          onChange={(e) => setInfo({ ...info, englishName: e.target.value })}
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='formBasicEmail'>
        <Form.Label>Full Name in Arabic</Form.Label>
        <Form.Control
          name='arabicName'
          placeholder='Full Name in Arabic'
          size='lg'
          onChange={(e) => setInfo({ ...info, arabicName: e.target.value })}
        />
      </Form.Group>
    </Form>
  )
}

export default FullName
