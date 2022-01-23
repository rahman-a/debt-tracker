import React, {useState, useEffect} from 'react'
import style from './style.module.scss'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {Alert} from 'react-bootstrap'
import actions from '../../actions'
import constants from '../../constants'
import {Loader} from '../../components'

const LoginCode = ({userId, setIsLoginCode}) => {
    const [isRememberOn, setIsRememberOn] = useState(false)
    const [rememberDays, setRememberDays] = useState(1)
    const [loginCode, setLoginCode] = useState('')
    const {loading, error, message} = useSelector(state => state.sendLoginCode)
    const {loading:login_loading, error:login_error, isAuth} = useSelector(state => state.login)
    const navigate = useNavigate() 
    const dispatch = useDispatch()
    
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
                size='20' 
                center 
                options={{animation:'border'}} 
                text='sending login code....'/>
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

            <p>A code has been sent to your E-mail</p>
            <p>Please Type this code to login</p>
            <div className={style.loginCode__group}>
                <div className={style.loginCode__group_input}>
                    <span>
                        CODE
                    </span>
                    <input 
                    type="text" 
                    placeholder='enter the code sent to your E-mail'
                    onChange={(e) => setLoginCode(e.target.value)}/>
                </div>
                <button onClick={loginHandler}>
                    {
                        login_loading 
                        ? <Loader size='4' options={{animation:'border'}}/>
                        : 'verify'
                    }
                </button>
            </div>
            
            <div className={style.loginCode__remember}>
                <input 
                type="checkbox" 
                id='remember'
                onChange={rememberPanelHandler}
                />
                <label htmlFor="remember">Remember me</label>
            </div>
            </>}
            {isRememberOn && <div className={style.loginCode__remember_panel}>
                <p>Please make this choice if you login from a computer you trust.</p>
                <p>Remember my credential for</p>
                <div className={style.loginCode__remember_panel_period}>
                    <button 
                    className={rememberDays === 7 ? style.loginCode__remember_panel_period_select : ''}
                    onClick={() => defineRememberDays(7)}>
                        7 days
                    </button>
                    <button 
                    className={rememberDays === 15 ? style.loginCode__remember_panel_period_select : ''}
                    onClick={() => defineRememberDays(15)}>
                        15 days
                    </button>
                    <button 
                    className={rememberDays === 30 ? style.loginCode__remember_panel_period_select : ''}
                    onClick={() => defineRememberDays(30)}>
                        30 day
                    </button>
                </div>
            </div>}
        </div>
    )
}

export default LoginCode 
