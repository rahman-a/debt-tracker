import React from 'react'
import style from './style.module.scss'

const Currency = () => {
    return (
        <div className={style.currency}>
            <img src="/images/usa-flag.jpg" alt="usa flag" 
            style={{
                width:'2.2rem',
                marginRight:'0.5rem'
            }} />
            <span>USD - </span>
            <span style={{fontSize:'1.4rem'}}>USD Dollar</span>
        </div>
    )
}

export default Currency
