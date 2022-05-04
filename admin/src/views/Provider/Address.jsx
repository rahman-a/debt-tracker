import React from 'react'
import style from './style.module.scss'
import {Form} from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const Address = ({getInfoValues}) => {
  const {t} = useTranslation()
  return (
    <div className={style.provider__segment}>
        <h2>{t('address-information')}</h2>
        
        <Form.Group className="mb-3" controlId="formBasicInsideAddress">
            <Form.Label>{t('address-in-uae')}</Form.Label>
            <Form.Control 
            size='lg' 
            type="text"
            name='insideAddress' 
            placeholder={t('address-in-uae')} 
            onChange={(e) => getInfoValues(e)}/>
        </Form.Group>
        
        <Form.Group className="mb-3" controlId="formBasicOutsideAddress">
            <Form.Label>{t('address-out-uae')}</Form.Label>
            <Form.Control 
            size='lg' 
            type="text"
            name='outsideAddress' 
            placeholder={t('address-out-uae')}
            onChange={(e) => getInfoValues(e)}/>
        </Form.Group>

    </div>
  )
}

export default Address