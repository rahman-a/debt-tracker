import React from 'react'
import style from './style.module.scss'
import messages from './data'
import { Message } from '@/src/components'
import { Pagination } from '@/src/components'

const Messages = () => {
  return (
    <div className={style.messages}>
      <div className='container'>
        <div className={style.messages__wrapper}>
          <h1>Messages</h1>
          {messages.map((message) => {
            return (
              <Message
                data={{
                  title: message.title,
                  image: message.image && message.image,
                  date: message.date,
                  message: message.message,
                }}
              />
            )
          })}
          <Pagination count={5} />
        </div>
      </div>
    </div>
  )
}

export default Messages
