import React from 'react'
import style from './style.module.scss'
import { Certificate } from '@/src/icons'

const Message = ({ data }) => {
  return (
    <div className={style.message}>
      {data.image ? (
        <img src={data.image} alt={data.title} />
      ) : (
        <span>
          <Certificate />
        </span>
      )}
      <div className={style.message__content}>
        <h3>{data.title}</h3>
        <span>{data.date}</span>
        <p>{data.message}</p>
      </div>
    </div>
  )
}

export default Message
