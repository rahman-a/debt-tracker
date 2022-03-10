import React, {useState, useEffect} from 'react'
import style from './style.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import {Alert} from 'react-bootstrap'
import {CircleCheck, Verify} from '../../icons'
import {Input, SideButton, Loader} from '../../components'
import actions from '../../actions'
import constants from '../../constants'
import { useTranslation } from 'react-i18next'

const OTPCode = () => {
    const [completeCreation, setCompleteCreation] = useState(false)
    const [phoneCode, setPhoneCode] = useState(null)
    
    const {loading, error, message} = useSelector(state => state.VerifyPhoneCode)
    const {userId} = useSelector(state => state.registerCredential)
    const {
        loading:phone_loading, 
        error:phone_error, 
        message: phone_message
    } = useSelector(state => state.sendPhoneCode)

    const dispatch = useDispatch()

    const {t} = useTranslation()
    
    const clearAlert = _ => {
        dispatch({type:constants.users.SEND_PHONE_CODE_RESET})
    }
    
    const verifyPhoneCodeHandler = _ => {
        dispatch(actions.users.verifyPhoneCode(userId, phoneCode))
    }

    const sendPhoneCodeHandler = _ => {
        dispatch(actions.users.sendCodeToPhone(userId))
    }
    
    useEffect(() => {
        if(message){
            dispatch({type:constants.users.VERIFY_PHONE_CODE_RESET})
            setCompleteCreation(true)
        }
        error && window.scrollTo(0,0)
        error && console.log('Error Phone', error)
    },[message, error])
    return (
        <div className={style.done}>
          {error && <Alert variant='danger'>{error}</Alert>}  
            <span>
                <CircleCheck
                width='10rem'
                height='10rem'
                fill='#7dff6e'
                />
            </span>
            <h2 style={{fontSize:'3.5rem', fontWeight:'100'}}>{t('congratulation')}</h2>
            <p style={{marginBottom:'5rem', letterSpacing:'2px'}}>{t('account-created')}</p>
            
            {
            !completeCreation 
            ? <>  {/* Sent Code To Verify Phone Number */} 
                <p>{t('code-sent-phone')}</p>
                <p>{t('type-code-activate')}</p>
                <div
                style={{
                    display:'flex',
                    alignItems:'center',
                    marginTop:'1.5rem'
                }}>
                    <Input
                        type='number'
                        name='otp'
                        placeholder='type-code-sent-phone'
                        onChange={(e) => setPhoneCode(e.target.value)}
                        value={phoneCode}
                        icon={<strong className={style.done__icon}>OTP</strong>}
                    />
                    <SideButton 
                    noIcon 
                    text={!loading && <CircleCheck/>} 
                    loading={loading}
                    handler={verifyPhoneCodeHandler}/>
                </div>
                <button 
                className={style.done__sentAgain}
                onClick={sendPhoneCodeHandler}>
                  {
                  phone_loading
                  ? <Loader size='5' options={{animation:'border'}}/>
                  : t('send-code-again')
                  }  
                </button>
                { phone_error 
                &&<Alert variant='danger' dismissible onClose={clearAlert}>
                     {phone_error}
                 </Alert> }
                { phone_message 
                &&<Alert variant='success' dismissible onClose={clearAlert}>
                    {phone_message}
                 </Alert> }
            </>

            :<> {/* Phone has been verified and Sent Link to E-mail */}
            <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                <CircleCheck width='2.5rem' height='2.5rem' fill='#7dff6e'/>
                <p style={{
                    marginLeft:'1rem', 
                    fontWeight:'400', 
                    fontSize:'2rem'
                }}>{t('phone-verified')}</p>
            </div>
            <div className={style.done__emailSent}>
                {t('send-activation-link')}
            </div>
            </>}

        </div>
    )
}

export default OTPCode
