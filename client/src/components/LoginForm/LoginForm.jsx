import React, {useEffect, useState} from 'react'
import style from './style.module.scss'
import {Modal, Alert, Button, Form} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import {Loader} from '../../components'
import {Lock, AtSymbol} from '../../icons'
import actions from '../../actions'
import constants from '../../constants'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

const LoginForm = () => {
    const [isForget, setIsForget] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [resetLink, setResetLink] = useState('')
    const [confirmCodeEmail, setConfirmCodeEmail] = useState('')
    const [phoneCode, setPhoneCode] = useState('')
    const {loading, error} = useSelector(state => state.loginInit)
    const {loading:reset_loading, error:reset_error, message} = useSelector(state => state.sendResetLink)
    const {t} = useTranslation()
    const lang = i18next.language
    
    const {
        loading:phone_loading, 
        error:phone_error, 
        message: phone_message
    } = useSelector(state => state.sendPhoneCode)
    
    const  {
        loading:verify_loading,
        error:verify_error,
        message:verify_message
    } = useSelector(state => state.VerifyPhoneCode)
    
    const dispatch = useDispatch()
    
    
    const clearAlert = _ => {
        dispatch({type:constants.users.USER_LOGIN_RESET})
    }

    const submitLoginHandler = e => {
        const data = {email, password}
        dispatch(actions.users.LoginInit(data))
    }

    const sendPhoneCodeHandler = _ => {
        dispatch(actions.users.sendCodeToPhone(undefined,confirmCodeEmail))
    }

    const verifyPhoneCodeHandler = _ => {
       dispatch(actions.users.verifyPhoneCode(undefined, phoneCode, confirmCodeEmail))
    }
    
    const submitLoginOnKeyHandler = e => {
        if(e.keyCode === 13 || e.which === 13) {
            const data = {email, password}
            dispatch(actions.users.LoginInit(data))
        }
    }



    const submitResetPasswordEmail = () => {
        dispatch(actions.users.sendResetLink(resetLink))
    }   

    useEffect(() => {
       if(verify_message) {
        setTimeout(() => {
            dispatch({type:constants.users.SEND_PHONE_CODE_RESET}) 
            dispatch({type:constants.users.USER_LOGIN_RESET})
        },3000)
    }
    },[verify_message])

    return (
        <>
            <Modal show={isForget} onHide={() => setIsForget(false)}>
                <Modal.Header>
                    <h3 className={style.loginForm__reset_header}>
                        {t('enter-email-reset-pass')}
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
                    <div  className={`${style.loginForm__reset_input} ${lang === 'ar' ? style.loginForm__reset_input_ar :''}`}>
                        <span>
                            <AtSymbol/>
                        </span>
                        <input 
                        type="email"
                        name='email'
                        onChange={(e) => setResetLink(e.target.value)}
                        placeholder={t('enter-email')}/>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <button className={style.loginForm__reset_btn}
                    disabled={reset_loading}
                    onClick={submitResetPasswordEmail}>
                        {t('send-reset-pass-btn')}
                    </button>
                </Modal.Footer>

            </Modal>

           
           {/* Enter Phone Code for Verification */}
          { phone_message  
          && <div className={style.loginForm__verify}>
                {
                    verify_error 
                    && <p 
                    className={style.loginForm__verify_alert}
                    style={{color:'#610202', backgroundColor:'#ffe1e1'}}>
                        {verify_error}
                    </p>
                }
                {
                    verify_message
                    && <p 
                    className={style.loginForm__verify_alert}
                    style={{color:'#1a5501', backgroundColor:'#e2ffe1'}}>
                        {verify_message}
                    </p>
                }
                <div>
                    <input 
                    type="number" 
                    name='otp' 
                    placeholder={t('enter-code')}
                    onChange={(e) => setPhoneCode(e.target.value)}/>
                    
                    <Button 
                    size='lg'
                    variant='dark'
                    style={{marginLeft:'1.5rem'}}
                    onClick={verifyPhoneCodeHandler}>
                     {
                         verify_loading
                         ? <Loader size='4' options={{animation:'border'}}/>
                         : t('phone-verify')
                     }
                    </Button>
                </div>
           </div> }
           
           {!phone_message
           && error
           && error === ('phone not confirmed' || 'الهاتف غير مفعل')
           ? <Alert variant='light' onClose={clearAlert} dismissible>
               <Alert.Heading>{t('phone-not-confirmed')}</Alert.Heading>
               <p>{t('email-send-code-phone')}</p>
               
               <input 
               type="email" 
               name='email' 
               placeholder={t('type-primary-email')}
               style={{
                   display:'block',
                   margin:'1.5rem 0',
                   padding:'0.5rem',
                   width:'100%',
                   borderRadius:'1rem',
                   border:'1px solid #1a374d'
               }}
               onChange={(e) => setConfirmCodeEmail(e.target.value)}/>

               {phone_error && <p style={{color:'red'}}>{phone_error}</p>}
               
               <Button
               variant='dark'
               size='lg'
               disabled={phone_loading ? true : false}
               onClick={sendPhoneCodeHandler}>
                   {t('send-phone-code')}
                </Button>

              {phone_loading && <Loader size='10' center options={{animation:'border'}}/>} 
              
            </Alert>
           :error 
           && !phone_message  
           && <p 
           className={style.loginForm__verify_alert}
           style={{color:'#610202', backgroundColor:'#ffe1e1'}}>
               {error}
           </p>
            }

            <div className={style.loginForm}
            onKeyDown={submitLoginOnKeyHandler}>
                <div className={`${style.loginForm__group} ${lang === 'ar' ? style.loginForm__group_ar :''}`}>
                    <span>
                        <AtSymbol/>
                    </span>
                    <input 
                    type="email" 
                    name='email'
                    placeholder={t('enter-email')}
                    onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className={`${style.loginForm__group} ${lang === 'ar' ? style.loginForm__group_ar :''}`}>
                    <span>
                        <Lock/>
                    </span>
                    <input 
                    type="password" 
                    placeholder={t('enter-pass')}
                    onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button 
                className={style.loginForm__submit}
                onClick={submitLoginHandler}>
                   {loading 
                   ? <Loader size='4' options={{animation:'border'}}/> 
                   : t('login-submit')}
                </button>
                <button 
                className={style.loginForm__forget}
                onClick={() => setIsForget(true)}>
                    {t('forget-pass')}
                </button>
            </div>
        </>
    )
}

export default LoginForm
