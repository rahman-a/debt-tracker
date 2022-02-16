import React from 'react'
import style from './style.module.scss'
import {Form} from 'react-bootstrap'
import {v4 as uuidv4} from 'uuid'
import {Plus, Minus} from '../../icons'

const Credential = ({getInfoValues, setEmailValues, emailValues}) => {

    const addRemoveEmailHandler = (type, id) => {
        if(type === 'add') {
            setEmailValues([...emailValues, {id:uuidv4(), email:''}])
        }else if(type === 'remove' && emailValues.length > 1){
            const filteredEmails = emailValues.filter(email => email.id !== id) 
            setEmailValues(filteredEmails)
        }
    }

    const setEmailValueHandler = (id, value) => {
        const emails = [...emailValues]
        emails.forEach((email, idx) => {
            if(email.id === id) {
                email.email = value
                email.isPrimary = idx === 0
            }
        })
        setEmailValues(emails)
    }
  
    return (
    <div className={style.provider__segment}>
        <h2> Credential Information </h2> 
        <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control 
            size='lg' 
            type="text"
            name='username'
            placeholder="Enter username" 
            onChange={(e) => getInfoValues(e)}/>
        </Form.Group>
        <div>
            {
                emailValues.map((val, idx) => (
                <div className={style.provider__multiple} key={val.id}> 
                    <Form.Group controlId="formBasicEmail"
                    className={`mb-3 ${style.provider__multiple_single}`}>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control 
                        size='lg' 
                        type="email" 
                        placeholder="Enter email" 
                        onChange={(e) => setEmailValueHandler(val.id, e.target.value)}/>
                    </Form.Group>
                    {
                        idx === emailValues.length - 1 &&
                        <div className={style.provider__multiple_toggle}>
                            <span onClick={() => addRemoveEmailHandler('add')}> 
                                <Plus/> 
                            </span> 
                            <span onClick={() => addRemoveEmailHandler('remove', val.id)}>  
                                <Minus/> 
                            </span>
                        </div>
                    }
                </div>
                
            ))}
        </div>
        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Account Password</Form.Label>
            <Form.Control 
            size='lg' 
            type="password"
            name='password'
            placeholder="Enter password" 
            onChange={(e) => getInfoValues(e)}/>
        </Form.Group>
    </div>
  )
}

export default Credential