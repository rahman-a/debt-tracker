import React, {useEffect} from 'react'
import style from './style.module.scss'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {LoginForm} from '../../components'

const Login = () => {
    const {isAuth} = useSelector(state => state.login)
    const navigate = useNavigate()
    
    useEffect(() => {
        isAuth && navigate('/')
    },[isAuth])
    
    return (
        <div className={style.login}>
           <div className={style.login__wrapper}>
                <figure> <img src="/images/swtle.png" alt="logo" /> </figure>
                { <LoginForm/> }
           </div>
        </div>
    )
}

export default Login
