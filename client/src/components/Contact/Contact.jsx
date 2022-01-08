import React from 'react'
import style from './style.module.scss'
import {Facebook, Linkedin, Whatsapp} from '../../icons'

const Contact = () => {
    
    const submitFormHandler = e => {
        e.preventDefault()
    }
    
    return (
        <div className={style.contact}>
            <div className={style.contact__bg}></div>
            <div className="container">
                <div className={style.contact__wrapper}>
                    <div className={style.contact__description}>
                        <div className={style.contact__text}>
                            <h2>Lorem ipsum dolor sit  Lorem ipsum dolor sit</h2>
                            <p>  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                                eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam 
                                voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
                                clita kasd gubergren.
                            </p>
                        </div>
                        <div className={style.contact__social}>
                            <span>
                                <Facebook/>
                            </span>
                            <span>
                                <Linkedin/>
                            </span>
                            <span>
                                <Whatsapp/>
                            </span>
                        </div>
                    </div>
                    <div className={style.contact__form}>
                        <h3>Contact us</h3>
                        <form onSubmit={submitFormHandler}>
                            <input type="text" name="name" placeholder='Enter your Name'/>
                            <input type="email" name="email" placeholder='Enter your E-mail'/>
                            <input type="text" name="phone" placeholder='Enter your Phone'/>
                            <textarea 
                            name="message" 
                            id="message" 
                            cols="30" 
                            rows="10"
                            placeholder='Enter Your Message'>

                            </textarea>
                            <button>submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
