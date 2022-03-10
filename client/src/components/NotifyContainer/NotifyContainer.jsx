import React from 'react'
import style from './style.module.scss'
import { useNavigate } from 'react-router-dom'
import i18next from 'i18next'
import {Loader} from '../../components'
import { useTranslation } from 'react-i18next'

const NotifyContainer = ({
    title, 
    data, 
    setToggleNotification, 
    setToggleMessages,
    loading,
    error
}) => {
    
    const navigate = useNavigate()
    const {t} = useTranslation()

    const navigateToPage = () => {
        
        title === 'Notification'
        ? setToggleNotification(false)
        : title === 'Messages' && setToggleMessages(false)
        
        navigate(title === 'Notification'
        ? '/notifications'
        : title === 'Messages'
        && '/messages')
    }

    const lang = i18next.language


    return (
        <div className={`${style.notify__container} 
        ${lang === 'ar' ? style.notify__container_ar :''}`}>
            
            <h4>{title}</h4>
            <ul className={style.notify__list}
            style={{height:(loading || error) && '15rem'}}>
                {
                   data 
                   ? data.map(notify => {
                        return <li 
                        key={notify._id}
                        onClick={navigateToPage}
                        className={style.notify__item}
                        style={{backgroundColor: !notify.isRead ? '#dff5ff' : 'unset'}}>
                            <h3>{notify.title}</h3>
                            <p>{notify.body.substr(0,45) + '....'}</p>
                        </li>
                    })
                   : loading 
                   ? <Loader size='5' center options={{animation:'border'}}/>
                   : error 
                   && <p style={{color:'red', textAlign:'center'}}>
                       {error}
                    </p>
                }
                
            </ul>
            { data && <button onClick={navigateToPage}>{t("show-all")}</button> }
        </div>
    )
}

export default NotifyContainer
