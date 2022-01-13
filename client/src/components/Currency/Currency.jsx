import React from 'react'
import style from './style.module.scss'

const Currency = ({currency, inline}) => {
    
    const flags = {
        USD:'/images/usa-flag.jpg',
        AED:'/images/uae-flag.png',
        EURO:'/images/euro-flag.png'
    }

    const symbol = {
        
        USD:'USD Dollar',
        AED:'Emirati Dirham',
        EURO:'European Euro'
    }
    
    return (
        <div className={style.currency} 
        style={{display:inline ? 'inline-block' : 'block'}}>
            <img src={flags[currency]} alt="usa flag" 
            style={{
                width:'2.2rem',
                marginRight:'0.5rem'
            }} />
            <span>{currency} - </span>
            <span style={{fontSize:'0.9rem'}}>{symbol[currency]}</span>
        </div>
    )
}

export default Currency
