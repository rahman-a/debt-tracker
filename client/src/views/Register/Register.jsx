import React, {useState} from 'react'
import style from './style.module.scss'
import { useNavigate } from 'react-router-dom'

import {
    Address, 
    Personal, 
    Documents, 
    Phones, 
    Credential, 
    Progress, 
    Snapshot,
    Done
} from '../../components'
import {ArrowRight} from '../../icons'

const Register = () => {
    const [step, setStep] = useState(1)
    const navigate = useNavigate()
    
    const Component = {
        1: <Credential setStep={setStep}/>,
        2: <Personal setStep={setStep}/>,
        3: <Address setStep={setStep}/>,
        4: <Phones setStep={setStep}/>,
        5: <Documents setStep={setStep}/>,
        6: <Snapshot setStep={setStep}/>,
        7: <Done setStep={setStep}/>
    }

    return (
        <div className={style.register}>
            <button className={style.register__back} onClick={() => navigate('/')}>
                <span>
                    <ArrowRight/>
                </span>
                back to home
            </button>
            <div className="container" style={{paddingTop:'5rem'}}>
                <div className={style.register__wrapper}>
                    {step === 7
                    ? <Done/>
                    :<>
                        <Progress step={step}/>
                        <div className={style.register__data}>
                            {Component[step]}
                        </div>
                    </>}
                </div>
            </div>
        </div>
    )
}

export default Register
