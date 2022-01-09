import React from 'react'
import style from './style.module.scss'

const NotifyContainer = ({title, data}) => {
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
            <button>show all...</button>
        </div>
    )
}

export default NotifyContainer
