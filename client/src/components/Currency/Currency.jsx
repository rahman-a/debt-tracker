import React from 'react'
import i18next from 'i18next'

const Currency = ({currency, inline}) => {
    const lang = i18next.language 

    return (
        <div style={{display:inline ? 'inline-block' : 'block'}}>
            <img src={`/api/files/${currency.image}`} alt="usa flag" 
            style={{
                width:'2.2rem',
                marginRight:lang === 'ar' ? 'unset' :'0.5rem',
                marginLeft:lang === 'ar' ? '0.5rem' :'unset',
            }} />
            <span style={{
                fontSize:inline ? '1.5rem' : '1.2rem'
            }}>
                {currency.name} - 
            </span>
            <span style={{
                fontSize:inline ? '1rem' : '0.9rem'
            }}>
                {currency.abbr}
            </span>
        </div>
    )
}

export default Currency
