import React, {useState, useEffect, useRef} from 'react'
import style from './style.module.scss'
import {Badge} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'


const Segment = ({value, title, icon, type, page}) => {
    const [count, setCount] = useState(0)
    const increaseCount = useRef(null);
    const navigate = useNavigate()
    const {t} = useTranslation()
    const lang = i18next.language 

    const mainColor = {
        primary: '#007bff',
        success: '#28a745',
        danger: '#dc3545',
        dark: '#343a40',
        secondary: '#6c757d', 
        info: '#17a2b8',
        warning: '#ffc107'
    }
    
    useEffect(() =>{
        increaseCount.current = setInterval(() => {
            setCount(prev => prev + 1)
        },5)
        return () => clearInterval(increaseCount.current)
    },[])

    useEffect(() => {
        if(count === value) {
              clearInterval(increaseCount.current)
        }
    },[count])
  return (
 
    <div className={style.dashboard__segment}
    style={{color:mainColor[type]}}
    onClick={() => navigate(page)}>
        <span>
            {icon}
        </span>
        <div className={`${style.dashboard__segment_info} ${lang === 'ar' ? style.dashboard__segment_info_ar :''}`}>
            <h3>{t(title)}</h3>
            <p>
                <Badge bg={type}> {count} </Badge>
            </p>
        </div>
    </div>
  )
}

export default Segment