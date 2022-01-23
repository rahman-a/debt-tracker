import React, {useState} from 'react'
import style from './style.module.scss'
import {ChevronDown} from '../../icons'
import {v4 as uuidv4} from 'uuid'

const DropdownMenu = ({data, onSelectHandler, disabled, className, countries}) => {
    // data = {label, icon, items:[{icon:'', text:'', value:''}]}
    const [isMenuToggle, setIsToggleMenu] = useState(false)
    const [labelName, setLabelName] = useState(data.label)
    
    const toggleMenuHandler = _ => {
        if(!disabled) {
            setIsToggleMenu(prev => !prev)
        }
    }
    
    const toggleMenuItemHandler = (text, value, item) => {
        setIsToggleMenu(false)
        setLabelName(text)
       countries
       ? onSelectHandler(item)
       : onSelectHandler(value)
    }

    return (
        <div className={`
        ${style.dropdown} 
        ${disabled ? style.dropdown__disabled :''}
        ${className ? className : ''}`}>

            <div className={style.dropdown__actions}
            style={{padding: data.icon ? "2rem 0" : '0.5rem 1rem'}}
            onClick={toggleMenuHandler}>

                { 
                    data.icon 
                    && 
                    <span className={style.dropdown__icon}> 
                        {data.icon}
                    </span>
                }
                
                <span className={style.dropdown__label}>
                    {labelName}
                </span>
                
                <span className={style.dropdown__toggle}>
                    <ChevronDown/>
                </span>

            </div>
            <ul className={`${style.dropdown__list} ${data.icon ? style.dropdown__list_icon :''}`}
                style={{ display:isMenuToggle ? 'block' : 'none'}}>
                {
                    data.items.map(item => {
                        return <li key={uuidv4()} onClick={() => toggleMenuItemHandler(item.text, item.value, item)}>
                            {
                                item.icon 
                                && 
                                <span> {item.icon} </span> 
                            }
                            {
                                item.svg 
                                && <img 
                                src={item.svg} 
                                alt={item.value} 
                                width='25' 
                                style={{marginRight:'1rem'}}/>
                            } 
                            <div>
                            {
                                item.abbr 
                                ? `${item.abbr} ${item.text}`
                                : item.text
                            }
                            </div>  
                        </li>
                    })
                }
            </ul>
        </div>
    )
}

export default DropdownMenu
