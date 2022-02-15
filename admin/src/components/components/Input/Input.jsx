import React from 'react'
import style from './style.module.scss'

const Input = ({
    icon, 
    label, 
    type, 
    placeholder, 
    name, 
    id,
    error, 
    value,
    inputRef,
    defaultValue,
    onChange,
    direction,
    className,
    custom,
    disabled
}) => {
 
    return (
        <div className={`
        ${style.input} 
        ${direction === 'right' ? style.input__right :''}
        ${type === 'file' ? style.input__upload :''}
        ${className}
        `} style={{...custom}}>
           
           {!(type === 'date') && 
           <span  className={`${style.input__icon} ${disabled ? style.input__icon_disabled : ''}`}>
               {icon}
           </span>}
           
           {type === 'file' && <p className={style.input__upload_label}>{placeholder}</p>}
           <label htmlFor={id ||name}>{label}</label>
           
           <input 
                placeholder={placeholder}
                name={name}
                type={type}
                id={id || name}
                defaultValue={defaultValue}
                value={value || ''}
                onChange={onChange}
                ref={inputRef}
                disabled={disabled}
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
