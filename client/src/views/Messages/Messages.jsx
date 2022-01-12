import React, {useState} from 'react'
import style from './style.module.scss'
import {Message} from '../../components'
import messages from './data'
import {Pagination, DropdownMenu} from '../../components'

const Messages = () => {
    const [toggleDropdown, setToggleDropdown] = useState(false)
    return (
        <div className={style.messages}>
            <div className="container">
                <div className={style.messages__wrapper}>
                    <h1>Messages</h1>
                    {
                        messages.map(message => {
                            return <Message 
                                data = {{
                                    title:message.title,
                                    image:message.image && message.image,
                                    date:message.date,
                                    message:message.message
                                }}
                            />
                        })
                    }
                <Pagination count={5}/>
                </div>
            </div>
        </div>
    )
}

export default Messages
