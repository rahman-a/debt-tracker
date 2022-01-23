import React from 'react'
import style from './style.module.scss'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {LoginForm, LoginCode} from '../../components'
import {ArrowRight} from '../../icons'

const Login = () => {
    const {userId} = useSelector(state => state.loginInit)

    const navigate = useNavigate()
    

    return (
        <div className={style.login}>
            <button className={style.login__back} onClick={() => navigate('/')}>
                <span>
                    <ArrowRight/>
                </span>
                back to home
            </button>
           <div className={style.login__wrapper}>
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
