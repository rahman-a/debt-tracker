import React, {useState} from 'react'
import style from './style.module.scss'

const LoginCode = () => {
    const [isRememberOn, setIsRememberOn] = useState(false)
    const [rememberDays, setRememberDays] = useState(1)
    
    const defineRememberDays = days => {
        setRememberDays(days)
    }

    const rememberPanelHandler = e => {
        if(isRememberOn) setRememberDays(1)
        setIsRememberOn(prev => !prev)
    }
    return (
        <div className={style.loginCode}>
            <p>A code has been sent to your E-mail</p>
            <p>Please Type this code to login</p>
            <div className={style.loginCode__group}>
                <div className={style.loginCode__group_input}>
                    <span>
                        CODE
                    </span>
                    <input type="text" placeholder='enter the code sent to your E-mail'/>
                </div>
                <button>login</button>
            </div>
            <div className={style.loginCode__remember}>
                <input 
                type="checkbox" 
                id='remember'
                onChange={rememberPanelHandler}/>
                <label htmlFor="remember">Remember me</label>
            </div>
            {isRememberOn && <div className={style.loginCode__remember_panel}>
                <p>Please make this choice if you login from a computer you trust.</p>
                <p>Remember my credential for</p>
                <div className={style.loginCode__remember_panel_period}>
                    <button 
                    className={rememberDays === 7 ? style.loginCode__remember_panel_period_select : ''}
                    onClick={() => defineRememberDays(7)}>
                        7 days
                    </button>
                    <button 
                    className={rememberDays === 15 ? style.loginCode__remember_panel_period_select : ''}
                    onClick={() => defineRememberDays(15)}>
                        15 days
                    </button>
                    <button 
                    className={rememberDays === 30 ? style.loginCode__remember_panel_period_select : ''}
                    onClick={() => defineRememberDays(30)}>
                        30 day
                    </button>
                </div>
            </div>}
        </div>
    )
}

export default LoginCode 
