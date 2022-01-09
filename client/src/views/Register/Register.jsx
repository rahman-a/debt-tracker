import React, {useState} from 'react'
import style from './style.module.scss'
import {
    Address, 
    Personal, 
    Documents, 
    Phones, 
    Credential, 
    Progress, 
    Done
} from '../../components'

const Register = () => {
    const [step, setStep] = useState(1)
    
    const components = {
        1: <Credential setStep={setStep}/>,
        2: <Personal setStep={setStep}/>,
        3: <Address setStep={setStep}/>,
        4: <Phones setStep={setStep}/>,
        5: <Documents setStep={setStep}/>,
        6: <Done setStep={setStep}/>
    }

    return (
        <div className={style.register}>
            <div className="container" style={{paddingTop:'5rem'}}>
                <div className={style.register__wrapper}>
                    {step === 6
                    ? <Done/>
                    :<>
                        <Progress step={step}/>
                        <div className={style.register__data}>
                            {components[step]}
                        </div>
                    </>}
                </div>
            </div>
        </div>
    )
}

export default Register
