import React from 'react'
import style from './style.module.scss'
import {Form} from 'react-bootstrap'
import {DateInput} from '../../components'
import { useTranslation } from 'react-i18next'

const Documents = ({
    getInfoValues, 
    setIdentity, 
    identity,
    setPassport,
    passport,
    setResidential,
    residential
}) => {

    const {t} = useTranslation()

  return (
    <div className={style.provider__segment}>
    <h2>{t('provider-documents')}</h2>
        <div style={{marginBottom:'1rem', borderBottom:'1px solid #ccc'}}>
            <Form.Group controlId="formFilePersonal" className="mb-3">
                <Form.Label>{t('upload-provider-photo')}</Form.Label>
                <Form.Control 
                type="file" 
                size='lg'
                name='avatar'
                onChange={(e) => getInfoValues(e)}/>
            </Form.Group>
        </div>
        
        <div style={{marginBottom:'1rem', borderBottom:'1px solid #ccc'}}>
            <Form.Group controlId="formFileIdentity" className="mb-3">
                <Form.Label>{t('upload-provider-identity')}</Form.Label>
                <Form.Control 
                type="file" 
                size='lg'
                onChange={(e) => setIdentity({...identity,image:e.target.files[0]})}/>
            </Form.Group>
            
            <DateInput name='identity' 
                custom={{marginLeft:'0', transform:'unset'}}
                getExpiryDate={(date) => setIdentity({...identity,expireAt:date})}/>           
        </div>
    
        <div style={{marginBottom:'1rem', borderBottom:'1px solid #ccc'}}>
            <Form.Group controlId="formFilePassport" className="mb-3">
                <Form.Label>{t('upload-provider-passport')}</Form.Label>
                <Form.Control 
                type="file" 
                size='lg'
                onChange={(e) => setPassport({...passport, image:e.target.files[0]})}/>
            </Form.Group>
            <DateInput name='passport' 
                custom={{marginLeft:'0', transform:'unset'}}
                getExpiryDate={(date) => setPassport({...passport, expireAt:date})}/>
        </div>
        
        <div style={{marginBottom:'1rem', borderBottom:'1px solid #ccc'}}>
            <Form.Group controlId="formFileResidential" className="mb-3">
                <Form.Label>{t('upload-provider-residential')}</Form.Label>
                <Form.Control 
                type="file" 
                size='lg'
                onChange={(e) => setResidential({...residential,image:e.target.files[0]})}/>
            </Form.Group>
            <DateInput name='residential' 
                custom={{marginLeft:'0', transform:'unset'}}
                getExpiryDate={(date) => setResidential({...residential, expireAt:date})}/>
        </div>
    </div>
  )
}

export default Documents