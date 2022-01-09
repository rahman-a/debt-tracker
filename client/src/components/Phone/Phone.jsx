import React, {useState} from 'react'
import {Input, SideButton, Button} from '../../components'
import {Phone} from '../../icons'
import {v4 as uuidv4} from 'uuid'

const Phones = ({setStep}) => {
    const [moreInsidePhone, setMoreInsidePhone] = useState(1)
    const [moreOutsidePhone, setMoreOutsidePhone] = useState(1)
    const moveNextHandler = _ => {
        setStep(5)
    }

    const addMorePhoneHandler = where => {
        if(where === 'inside') {
            setMoreInsidePhone(prev => prev + 1)
        }else {
            setMoreOutsidePhone(prev => prev + 1)
        }
    }

    const removeMorePhoneHandler = where => {
        if(where === 'inside') {
            setMoreInsidePhone(prev => prev - 1)
        }else {
            setMoreOutsidePhone(prev => prev - 1)
        }
    }
    
    return (
        <>
            {/* INPUTS TO ENTER PHONES NUMBERS INSIDE UAE*/}
            {
                [...Array(moreInsidePhone)].map((_, idx) => {
                    return<div key={uuidv4()} style={{
                        display:'flex',
                        alignItems:'center'
                    }}> 
                        <Input
                            name='insidePhone'
                            placeholder='Phone inside UAE'
                            label='Phone inside UAE'
                            type='text'
                            icon={<Phone/>}
                            custom={{marginBottom:'3rem'}}
                        />
                        {moreInsidePhone === (idx + 1) 
                        && <SideButton text='another phone' handler={() => addMorePhoneHandler('inside')}/>}
                        {moreInsidePhone === (idx + 1) && moreInsidePhone > 1 
                        && <SideButton minus text='remove phone' handler={() => removeMorePhoneHandler('inside')}/>}
                        </div>
                    
                }) 
            }
            
            {/* INPUTS TO ENTER PHONES NUMBERS OUTSIDE UAE*/}
            {
                [...Array(moreOutsidePhone)].map((_, idx) => {
                    return <div key={uuidv4()} style={{
                        display:'flex',
                        alignItems:'center'
                    }}>
                        <Input 
                        name='outsidePhone'
                        placeholder='Phone outside UAE'
                        label='Phone outside UAE'
                        type='text'
                        icon={<Phone/>}
                        custom={{marginBottom:'3rem'}}
                        /> 
                        {
                        moreOutsidePhone === (idx + 1) 
                        && <SideButton text='another phone' handler={() => addMorePhoneHandler('outside')}/> 
                        }
                        {
                        moreOutsidePhone === (idx + 1) && moreOutsidePhone > 1
                        && <SideButton minus text='remove phone' handler={() => removeMorePhoneHandler('outside')}/> 
                        }
                    </div>
                })
            }
          
          <Button value='next' handler={moveNextHandler}/> 
        </>
    )
}

export default Phones