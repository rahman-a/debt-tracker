import React, {useEffect, useState} from 'react'
import style from './style.module.scss'
import {Modal, Alert} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import {Loader} from '../../components'
import {Lock, AtSymbol} from '../../icons'
import actions from '../../actions'
import constants from '../../constants'

const LoginForm = () => {
    const [isForget, setIsForget] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [resetLink, setResetLink] = useState('')
    const {loading, error} = useSelector(state => state.login)
    const {loading:reset_loading, error:reset_error, message} = useSelector(state => state.sendResetLink)
    
    
    const dispatch = useDispatch()
    
    
    const clearAlert = _ => {
        dispatch({type:constants.admin.ADMIN_LOGIN_RESET})
    }

    const submitLoginHandler = e => {
        const data = {email, password}
        dispatch(actions.admin.login(data))
    }
    
    const submitLoginOnKeyHandler = e => {
        if(e.keyCode === 13 || e.which === 13) {
            const data = {email, password}
            dispatch(actions.admin.login(data))
        }
    }

    const submitResetPasswordEmail = () => {
        dispatch(actions.admin.sendResetLink(resetLink))
    }   

    return (
        <>
            <Modal show={isForget} onHide={() => setIsForget(false)}>
                <Modal.Header closeButton>
                    <h3 className={style.loginForm__reset_header}>
                        Enter Your Email to Reset Your Password
                    </h3>
                </Modal.Header>

                <Modal.Body>
                   { 
                   reset_loading && <Loader 
                    size='10' 
                    center 
                    options={{animation:'border'}}
                    custom={{zIndex:'99'}}/> 
                    }
                    {message && <p className={style.loginForm__reset_msg}
                    style={{color:'#025902', backgroundColor:'#d0f8eb'}}>
                        {message}
                    </p>}
                    {reset_error && <p className={style.loginForm__reset_msg}
                    style={{color:'#590202', backgroundColor:'#f8d0d0'}}>
                        {reset_error}
                    </p>}
                    <div className={style.loginForm__reset_input}>
                        <span>
                            <AtSymbol/>
                        </span>
                        <input 
                        type="email"
                        name='email'
                        onChange={(e) => setResetLink(e.target.value)}
                        placeholder='Enter Your E-mail'/>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <button className={style.loginForm__reset_btn}
                    disabled={reset_loading}
                    onClick={submitResetPasswordEmail}>
                        Send Link
                    </button>
                </Modal.Footer>

            </Modal>
            {
                error && 
                <Alert variant='danger' dismissible onClose={() => clearAlert()}> 
                    {error} 
                </Alert>
            }
            <div className={style.loginForm}
            onKeyDown={submitLoginOnKeyHandler}>
                <div className={style.loginForm__group}>
                    <span>
                        <AtSymbol/>
                    </span>
                    <input 
                    type="email" 
                    name='email'
                    placeholder='Enter Your E-mail'
                    onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className={style.loginForm__group}>
                    <span>
                        <Lock/>
                    </span>
                    <input 
                    type="password" 
                    placeholder='Enter Your Password'
                    onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button 
                className={style.loginForm__submit}
                onClick={submitLoginHandler}>
                   {loading 
                   ? <Loader size='4' options={{animation:'border'}}/> 
                   : 'submit'}
                </button>
                <button 
                className={style.loginForm__forget}
                onClick={() => setIsForget(true)}>
                    forget password
                </button>
            </div>
        </>
    )
}

export default LoginForm
