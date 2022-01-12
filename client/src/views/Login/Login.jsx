import React, {useState} from 'react'
import style from './style.module.scss'
import { useNavigate } from 'react-router-dom'
import {LoginForm, LoginCode} from '../../components'
import {ArrowRight} from '../../icons'

const Login = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
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
                isAuthenticated 
                ? <LoginCode/>
                : <LoginForm setIsAuthenticated={setIsAuthenticated}/>
                }
           </div>
        </div>
    )
}

export default Login
