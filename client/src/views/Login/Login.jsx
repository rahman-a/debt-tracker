import React from 'react'
import style from './style.module.scss'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {LoginForm, LoginCode} from '../../components'
import {ArrowRight, ArrowLeft} from '../../icons'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

const Login = () => {
    const {userId} = useSelector(state => state.loginInit)

    const navigate = useNavigate()
    const {t} = useTranslation()
    const lang = i18next.language
    return (
        <div className={style.login}>
            <button style={{direction:'ltr'}} className={style.login__back} onClick={() => navigate('/')}>
                <span>
                   <ArrowRight/>
                </span>
               {t('back-home')}
            </button>
           <div className={style.login__wrapper}>
           <figure> <img src="/images/swtle.png" alt="logo" /> </figure>
                {
                userId 
                ? <LoginCode userId={userId}/>
                : <LoginForm/>
                }
           </div>
        </div>
    )
}

export default Login
