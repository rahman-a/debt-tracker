import React from 'react'
import style from './style.module.scss'
import {Badge} from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const ExpiredImageContainer = ({img, document}) => {
    
    const {t} = useTranslation()
    
    return (
    <div className={style.segment__doc}>
        <div className={style.segment__backdrop}></div>
        <img src={img} alt={document} />
        <Badge bg="light" text="dark"> {t('expired')} </Badge>
    </div>
    )
}

export default ExpiredImageContainer