import React from 'react'
import style from './style.module.scss'
import {Social} from '../../components'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

const Contact = () => {
    
    const submitFormHandler = e => {
        e.preventDefault()
    }

    const {t} = useTranslation()
    const lang = i18next.language 

    return (
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
                            <input type="text" name="name" placeholder={t('enter-name')}/>
                            <input type="email" name="email" placeholder={t('enter-email')}/>
                            <input type="text" name="phone" placeholder={t('enter-phone')}/>
                            <textarea 
                            name="message" 
                            id="message" 
                            cols="30" 
                            rows="10"
                            placeholder={t('enter-message')}>
                            </textarea>
                            <button>{t('contact-send')}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
