import React, {useState, useEffect} from 'react'
import style from './style.module.scss'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {Alert} from 'react-bootstrap'
import actions from '../../actions'
import constants from '../../constants'
import {Loader} from '../../components'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

const LoginCode = ({userId, setIsLoginCode}) => {
    const [isRememberOn, setIsRememberOn] = useState(false)
    const [rememberDays, setRememberDays] = useState(1)
    const [loginCode, setLoginCode] = useState('')
    const {loading, error, message} = useSelector(state => state.sendLoginCode)
    const {loading:login_loading, error:login_error, isAuth} = useSelector(state => state.login)
    const navigate = useNavigate() 
    const dispatch = useDispatch()
    const {t} = useTranslation()
    const lang = i18next.language
    const defineRememberDays = days => {
        setRememberDays(days)
    }

    const clearAlert = _ => {
        dispatch({type:constants.users.SEND_LOGIN_CODE_RESET})
    }
    
    const clearLoginAlert = _ => {
        dispatch({type:constants.users.VERIFY_LOGIN_CODE_RESET})
    }

    const rememberPanelHandler = e => {
        if(isRememberOn) setRememberDays(1)
        setIsRememberOn(prev => !prev)
    }

    const loginHandler = _ => {
        dispatch(actions.users.login(userId, {code:loginCode, rememberDays}))
    }

    

    useEffect(() => {
        if(userId && !message) {
            dispatch(actions.users.sendLoginCode(userId))
        }
        if(isAuth) {
            navigate('/operation')
        }
    },[userId, isAuth])
    
    return (
        <div className={style.loginCode}>
           { loading 
           ? <Loader 
                size='10' 
                center 
                options={{animation:'border'}} 
                text={t('sending-login-code')}
                textStyle={{
                    marginLeft:lang === 'ar' ? '0' : '-5rem',
                    marginRight:lang === 'ar' ? '-5rem' : '0',
                }}/>
           : error 
           ? <Alert 
                variant='danger' 
                onClose={clearAlert} dismissible>
               {error}
            </Alert>
           :message && 
           <> 
           
           {
            login_error &&
            <Alert 
            variant='danger'
            onClose={clearLoginAlert}>
               {login_error}
            </Alert>
           } 

            <p>{t('code-sent')}</p>
            <p style={{marginLeft:'unset', width:'auto'}}>{t('type-code')}</p>
            <div className={`${style.loginCode__group} 
            ${lang === 'ar' ? style.loginCode__group_ar : ''}`}>
                <div className={style.loginCode__group_input}>
                    <span className={lang === 'ar' ? style.loginCode__group_input_ar : '' }>
                       {t('login-code')}
                    </span>
                    <input 
                    type="text" 
                    placeholder={t('enter-code-sent-email')}
                    onChange={(e) => setLoginCode(e.target.value)}/>
                </div>
                <button onClick={loginHandler}>
                    {
                        login_loading 
                        ? <Loader size='4' options={{animation:'border'}}/>
                        : t('phone-verify')
                    }
                </button>
            </div>
            
            <div className={`${style.loginCode__remember} 
            ${lang === 'ar' ? style.loginCode__remember_ar : ''}`}>
                <input 
                type="checkbox" 
                id='remember'
                onChange={rememberPanelHandler}
                />
                <label htmlFor="remember">{t('remember-me')}</label>
            </div>
            </>}
            {isRememberOn && <div className={style.loginCode__remember_panel}>
                <p>{t('choice-if-trust-pc')}</p>
                <p>{t('remember-credential')}</p>
                <div className={style.loginCode__remember_panel_period}>
                    <button 
                    className={rememberDays === 7 ? style.loginCode__remember_panel_period_select : ''}
                    onClick={() => defineRememberDays(7)}>
                       {t('remember-7')}
                    </button>
                    <button 
                    className={rememberDays === 15 ? style.loginCode__remember_panel_period_select : ''}
                    onClick={() => defineRememberDays(15)}>
                        {t('remember-15')}
                    </button>
                    <button 
                    className={rememberDays === 30 ? style.loginCode__remember_panel_period_select : ''}
                    onClick={() => defineRememberDays(30)}>
                        {t('remember-30')}
                    </button>
                </div>
            </div>}
        </div>
    )
}

export default LoginCode 
