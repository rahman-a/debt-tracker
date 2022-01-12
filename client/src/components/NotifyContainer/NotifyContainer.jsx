import React from 'react'
import style from './style.module.scss'
import { useNavigate } from 'react-router-dom'

const NotifyContainer = ({title, data, setToggleNotification, setToggleMessages}) => {
    const navigate = useNavigate()
    const navigateToPage = () => {
        
        title === 'Notification'
        ? setToggleNotification(false)
        : title === 'Messages' && setToggleMessages(false)
        
        navigate(title === 'Notification'
        ? '/notifications'
        : title === 'Messages'
        && '/messages')
    }
    return (
        <div className={style.notify__container}>
            <h4>{title}</h4>
            <ul className={style.notify__list}>
                {
                    data.map(notify => {
                        return <li key={notify.id} className={style.notify__item}>
                            <h3>{notify.title}</h3>
                            <p>{notify.content.substr(0,45) + '....'}</p>
                        </li>
                    })
                }
            </ul>
            <button onClick={navigateToPage}>
                show all...
            </button>
        </div>
    )
}

export default NotifyContainer
