import React from 'react'
import style from './style.module.scss'
import {useNavigate} from 'react-router-dom'
import {ArrowRight} from '../../icons'

const BackButton = ({page, position}) => {
  
    const navigate = useNavigate()
    const getStyle = _ => {
        let style = { 
        top:'2rem',
        left:'10rem',
    }
        if(position === 'right') {
            style = {
                top:'2rem',
                right:'10rem'
            }
        }
        return style
    }

    const arrowStyle = _ => {
        let style = {
            transform: 'rotate(180deg) translate(0, -2px)'
        }
        if(position === 'right') {
            style = {
                transform:'translate(0px, -2px)',
                position:'absolute',
                right:'-2rem',
                top: '1px'
            }
        }
        return style
    }
    return (
        <button className={style.back} 
        onClick={() => navigate(`/${page}`)}
        style={getStyle()}>
            <span style={arrowStyle()}> 
                <ArrowRight/> 
            </span>
            <span> back to members </span>
        </button>
  )
}

export default BackButton