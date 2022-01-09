import React from 'react'
import style from './style.module.scss'
import {useLocation} from 'react-router-dom'

const Footer = () => {
    const page = useLocation().pathname
    
    return (
        <div className={style.footer}
        style={{
            display: (page === '/login' || page === '/register') ? 'none' : 'block'
        }}>
            
        </div>
    )
}

export default Footer
