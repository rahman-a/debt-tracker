import React from 'react'
import style from './style.module.scss'
import {Form} from 'react-bootstrap'

const Address = ({getInfoValues}) => {
  return (
    <div className={style.provider__segment}>
        <h2>Address Information</h2>
        
        <Form.Group className="mb-3" controlId="formBasicInsideAddress">
            <Form.Label>Address inside UAE</Form.Label>
            <Form.Control 
            size='lg' 
            type="text"
            name='insideAddress' 
            placeholder="Enter address inside UAE" 
            onChange={(e) => getInfoValues(e)}/>
        </Form.Group>
        
        <Form.Group className="mb-3" controlId="formBasicOutsideAddress">
            <Form.Label>Address outside UAE</Form.Label>
            <Form.Control 
            size='lg' 
            type="text"
            name='outsideAddress' 
            placeholder="Enter address outside UAE" 
            onChange={(e) => getInfoValues(e)}/>
        </Form.Group>

    </div>
  )
}

export default Address