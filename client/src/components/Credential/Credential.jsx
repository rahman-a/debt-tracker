import React, {useState} from 'react'
import {Input, SideButton, Button} from '../../components'
import {EnvelopOpen, Key, Fingerprint} from '../../icons'
import {v4 as uuidv4} from 'uuid'

const Credential = ({setStep}) => {
    const [moreEmail, setMoreEmail] = useState(1)
    const [loading, setLoading] = useState(false)
    
    const submitHandler = _ => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setStep(2)
        },1000)
    }

    const addMoreEmailHandler = _ => {
        setMoreEmail(prev => prev + 1)
    }

    const removeMoreEmailHandler = where => {
        setMoreEmail(prev => prev - 1)
    }
    
    return (
        <>
            {/* INPUTS TO ENTER USERNAME*/}
            <Input
            type='text'
            placeholder='choose a unique username'
            name='username'
            label='choose a unique username'
            icon={<Fingerprint/>}
            custom={{marginBottom:'3rem'}}
            />
            
            {/* INPUTS TO ENTER Emails*/}
            {
                [...Array(moreEmail)].map((_, idx) => {
                    return<div key={uuidv4()} style={{
                        display:'flex',
                        alignItems:'center'
                    }}> 
                        <Input
                            name='email'
                            placeholder={idx > 0 ? 'Add Another E-mail' :'Main E-mail Address'}
                            label={idx > 0 ? 'Add Another E-mail' :'Main E-mail Address'}
                            type='email'
                            icon={<EnvelopOpen/>}
                            custom={{marginBottom:'3rem'}}
                        />
                        {moreEmail === (idx + 1) 
                        && <SideButton text='another email' handler={addMoreEmailHandler}/>}
                        {moreEmail === (idx + 1) && moreEmail > 1 
                        && <SideButton minus text='remove email' handler={removeMoreEmailHandler}/>}
                    </div>
                    
                }) 
            }
            
            <Input
                name='password'
                placeholder='Password'
                label='Password'
                type='password'
                icon={<Key/>}
                custom={{marginBottom:'3rem'}}
            />
          
          <Input
                name='confirmPassword'
                placeholder='Confirm Password'
                label='Confirm Password'
                type='password'
                icon={<Key/>}
                custom={{marginBottom:'3rem'}}
            />
            <div style={{
                display:'flex',
                alignItems:'center',
                textAlign: 'start',
                marginTop: '-2rem',
                color: '#fff',
                transform: 'translateX(10px)'
            }}>
                <input type="checkbox" name='isAgree' style={{marginRight:'1rem'}}/>
                <label style={{
                    fontSize:'1.4rem',
                }} htmlFor="terms">I Agree on <a href="#" style={{color:'#B1D0E0'}}>Terms & Condition</a></label>
            </div>
          <Button value='next' handler={submitHandler} loading={loading}/> 
        </>
    )
}

export default Credential