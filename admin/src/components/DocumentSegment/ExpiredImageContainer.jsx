import React from 'react'
import style from './style.module.scss'
import {Badge} from 'react-bootstrap'

const ExpiredImageContainer = ({img, document}) => {
    return (
    <div className={style.segment__doc}>
        <div className={style.segment__backdrop}></div>
        <img src={img} alt={document} />
        <Badge bg="light" text="dark"> Expired </Badge>
    </div>
    )
}

export default ExpiredImageContainer