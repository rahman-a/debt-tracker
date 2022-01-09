import React from 'react'
import style from './style.module.scss'
import {Plus, Minus} from '../../icons'

const SideButton = ({handler,text, minus, noIcon}) => {
    return (
       <button 
       className={`
       ${style.button__side}
       ${noIcon && style.button__side_noIcon}
       `}
       onClick={handler}
       >
           {minus 
           ? 
            <>
                <Minus/>
                <p>{text}</p>
            </>
           :
            <>
                {!noIcon && <Plus/>}
                <p>{text}</p>
            </>
           }
        </button>
    )
}

export default SideButton
