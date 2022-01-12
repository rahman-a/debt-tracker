import React, {useState} from 'react'
import style from './style.module.scss'
import {Lock, AtSymbol} from '../../icons'
import Modal from 'react-bootstrap/Modal'

const LoginForm = ({setIsAuthenticated}) => {
    const [isForget, setIsForget] = useState(false)
    
    const submitLoginHandler = _ => {
        console.log('Submit Login Handler');
        setIsAuthenticated(true)
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
                    <p className={style.loginForm__reset_msg}>
                        The Link has been sent to your E-mail
                    </p>
                    <div className={style.loginForm__reset_input}>
                        <span>
                            <AtSymbol/>
                        </span>
                        <input type="email" placeholder='Enter Your E-mail'/>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <button className={style.loginForm__reset_btn}>
                        Send Link
                    </button>
                </Modal.Footer>

            </Modal>
            <div className={style.loginForm}>
                <div className={style.loginForm__group}>
                    <span>
                        <AtSymbol/>
                    </span>
                    <input type="email" placeholder='Enter Your E-mail'/>
                </div>
                <div className={style.loginForm__group}>
                    <span>
                        <Lock/>
                    </span>
                    <input type="password" placeholder='Enter Your Password'/>
                </div>
                <button className={style.loginForm__submit} onClick={submitLoginHandler}>submit</button>
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
