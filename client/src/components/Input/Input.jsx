import React from 'react'
import style from './style.module.scss'

const Input = ({
    icon, 
    label, 
    type, 
    placeholder, 
    name, 
    error, 
    onChange,
    direction,
    custom
}) => {
 
    return (
        <div className={`
        ${style.input} 
        ${direction === 'right' ? style.input__right :''}
        ${type === 'file' ? style.input__upload :''}
        `} style={{...custom}}>
           
           {!(type === 'date') && <span  className={style.input__icon}>
               {icon}
           </span>}
           
           {type === 'file' && <p className={style.input__upload_label}>{placeholder}</p>}
           <label htmlFor={name}>{label}</label>
           
           <input 
                placeholder={placeholder}
                name={name}
                type={type}
                id={name}
                onChange={onChange}
                className={error ? style.input__error : ''}
                style={{
                    border: type === 'file' ? '2px dashed #fff' :'',
                    backgroundColor: type === 'file' ? 'transparent' : '#fff',
                    padding: type === 'date' 
                    ? '1rem' 
                    : direction !== 'right' 
                    && '1.5rem 1.5rem 1.5rem 5.5rem',
                    color:'#1A374D'
                    }}
            />
           
           {error && 
           <>
           <strong>ERROR</strong>
           <p  className={style.input__error_text}>{error}</p>
           </>}

        </div>
    )
}

export default Input
