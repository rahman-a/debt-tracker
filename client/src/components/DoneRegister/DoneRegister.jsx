import React, {useState} from 'react'
import style from './style.module.scss'
import {CircleCheck, Verify} from '../../icons'
import {Input, SideButton} from '../../components'

const OTPCode = () => {
    const [completeCreation, setCompleteCreation] = useState(false)
    return (
        <div className={style.done}>
            <span>
                <CircleCheck
                width='10rem'
                height='10rem'
                fill='#7dff6e'
                />
            </span>
            <h2 style={{fontSize:'3.5rem', fontWeight:'100'}}>Congratulation</h2>
            <p style={{marginBottom:'5rem', letterSpacing:'2px'}}>Your Account has been Created</p>
            
            {
            !completeCreation 
            ? <>  {/* Sent Code To Verify Phone Number */} 
                <p>A Code has been sent to your Phone</p>
                <p>Please type this code to activate your Phone</p>
                <div
                style={{
                    display:'flex',
                    alignItems:'center',
                    marginTop:'1.5rem'
                }}>
                    <Input
                        type='text'
                        name='otp'
                        placeholder='type the code sent to your phone'
                        icon={<strong className={style.done__icon}>OTP</strong>}
                    />
                    <SideButton noIcon text={<Verify/>} handler={() => setCompleteCreation(true)}/>
                </div>
                <button className={style.done__sentAgain}>sent code again</button>
            </>

            :<> {/* Verification of Phone Number and Sent Link to E-mail */}
            <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                <CircleCheck width='2.5rem' height='2.5rem' fill='#7dff6e'/>
                <p style={{
                    marginLeft:'1rem', 
                    fontWeight:'400', 
                    fontSize:'2rem'
                }}>Your Phone has been Verified</p>
            </div>
            <div className={style.done__emailSent}>
                A link has been sent to your E-mail, please click on it
                to activate your E-mail
            </div>
            </>}

        </div>
    )
}

export default OTPCode
