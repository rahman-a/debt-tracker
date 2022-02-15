import React from 'react'
import style from './style.module.scss'
import {Plus, Minus} from '../../icons'
import {Loader} from '../../components' 

const SideButton = ({handler,text, minus, noIcon, loading}) => {
    return (
       <button 
       style={{padding: loading ? '2.2rem 2rem' :'0'}}
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
                <p>{
                loading ? <Loader center size='4' options={{animation:'border'}}/>
                :text
                }</p>
            </>
           }
        </button>
    )
}

export default SideButton
