import React from 'react'
import style from './style.module.scss'
import {Form} from 'react-bootstrap'
import {v4 as uuidv4} from 'uuid'
import {Plus, Minus} from '../../icons'
import { useTranslation } from 'react-i18next'

const Credential = ({getInfoValues, setEmailValues, emailValues}) => {

    const {t} = useTranslation()

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
        <h2> {t('credential-info')} </h2> 
        <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>{t('username')}</Form.Label>
            <Form.Control 
            size='lg' 
            type="text"
            name='username'
            placeholder={t('username')}
            onChange={(e) => getInfoValues(e)}/>
        </Form.Group>
        <div>
            {
                emailValues.map((val, idx) => (
                <div className={style.provider__multiple} key={val.id}> 
                    <Form.Group controlId="formBasicEmail"
                    className={`mb-3 ${style.provider__multiple_single}`}>
                        <Form.Label>{t('email')}</Form.Label>
                        <Form.Control 
                        size='lg' 
                        type="email" 
                        placeholder={t('enter-email')}
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
            <Form.Label>{t('account-password')}</Form.Label>
            <Form.Control 
            size='lg' 
            type="password"
            name='password'
            placeholder={t('enter-provider-pass')}
            onChange={(e) => getInfoValues(e)}/>
        </Form.Group>
    </div>
  )
}

export default Credential