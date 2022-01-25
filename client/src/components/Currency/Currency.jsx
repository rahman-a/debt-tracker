import React from 'react'

const Currency = ({currency, inline}) => {
    
    return (
        <div style={{display:inline ? 'inline-block' : 'block'}}>
            <img src={`/api/files/${currency.image}`} alt="usa flag" 
            style={{
                width:'2.2rem',
                marginRight:'0.5rem'
            }} />
            <span style={{fontSize:'1.2rem'}}>{currency.name} - </span>
            <span style={{fontSize:'0.9rem'}}>{currency.abbr}</span>
        </div>
    )
}

export default Currency
