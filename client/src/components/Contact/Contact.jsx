import React, {useState, useEffect} from 'react'
import style from './style.module.scss'
import {Social, SideAlert, Loader} from '../../components'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import constants from '../../constants'
import actions from '../../actions'

const Contact = () => {
    const [contact, setContact] = useState({
        name:'',
        phone:'',
        email:'',
        message:''
    })
    const [errors, setErrors] = useState(null)
    const dispatch = useDispatch()
    const {loading, error, message} = useSelector(state => state.sendContactEmail)
    const {t} = useTranslation()
    const lang = i18next.language 

    const getContactInformation = e => {
        const value = {[e.target.name]:e.target.value} 
        setContact({...contact, ...value})
    }

    const isFormValid = _ => {
        if(!contact['name']) {
            setErrors(t('name_is_required'))
            return false
        }
        if(!contact['email']) {
            setErrors(t('email_is_required'))
            return false
        }
        if(!contact['phone']) {
            setErrors(t('phone_is_required'))
            return false
        }
        if(!contact['message']) {
            setErrors(t('message_is_required'))
            return false
        }

        return true
    }
    
    const submitFormHandler = e => {
        e.preventDefault()
        if(isFormValid()) {
          dispatch(actions.users.sendContactEmail(contact))
        }
    }

    const clearAlert = _ => {
        dispatch({type:constants.users.SEND_CONTACT_RESET})
        setErrors(null)
    }

    useEffect(() => {
        error && setErrors(error)
    },[error])

    return (

        <>
            <SideAlert
            type='danger'
            text={errors}
            isOn={errors ? true : false}
            reset={() => clearAlert()}
            /> 
            <SideAlert
            type='success'
            text={message}
            isOn={message ? true : false}
            reset={() => clearAlert()}
            /> 
            <div className={style.contact}>
                <Social/>
                <div className={style.contact__bg}></div>
                <div className="container">
                    <div className={style.contact__wrapper}>
                        <div className={`${style.contact__description} ${lang === 'ar' ? style.contact__description_ar : ''}`}>
                            <div className={style.contact__text}>
                                <h2>Lorem ipsum dolor sit  Lorem ipsum dolor sit</h2>
                                <p>  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                                    eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam 
                                    voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
                                    clita kasd gubergren.
                                </p>
                            </div>
                        </div>
                        <div className={style.contact__form}>
                            <h3>{t('contact-us')}</h3>
                            <form onSubmit={submitFormHandler}>
                                
                                <input 
                                    type="text" 
                                    name="name"
                                    value={contact['name']} 
                                    placeholder={t('enter-name')} 
                                    onChange={(e) => getContactInformation(e)}/>
                                
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={contact['email']} 
                                    placeholder={t('enter-email')} 
                                    onChange={(e) => getContactInformation(e)}/>
                                
                                <input 
                                    type="text" 
                                    name="phone"
                                    value={contact['phone']} 
                                    placeholder={t('enter-phone')} 
                                    onChange={(e) => getContactInformation(e)}/>
                                
                                <textarea 
                                    name="message" 
                                    id="message" 
                                    cols="30" 
                                    rows="10"
                                    value={contact['message']} 
                                    placeholder={t('enter-message')} 
                                    onChange={(e) => getContactInformation(e)}>
                                </textarea>

                                <button style={{padding:loading ? "0" : "1rem 0.5rem"}}>
                                    {
                                        loading 
                                        ? <Loader size='4' options={{animation:'border'}}/>
                                        : t('contact-send')
                                    }
                                </button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Contact
