import React, {useState, useRef, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {Alert} from 'react-bootstrap'
import {v4 as uuidv4} from 'uuid'
import {Input, SideButton, Button} from '../../components'
import {Phone} from '../../icons'
import actions from '../../actions'

const Phones = ({setStep, info}) => {
    const [moreInsidePhone, setMoreInsidePhone] = useState(1)
    const [moreOutsidePhone, setMoreOutsidePhone] = useState(1)
    const [insidePhones, setInsidePhones] = useState([])
    const [outsidePhones, setOutsidePhones] = useState([])
    const [insideFocus, setInsideFocus] = useState(false) 
    const [outsideFocus, setOutsideFocus] = useState(false)
    const [errors, setErrors] = useState('')
    const {loading, error, isDone} = useSelector(state => state.registerInfo)
    const {userId} = useSelector(state => state.registerCredential)
    const dispatch = useDispatch()
    const insideRef = useRef()
    const outsideRef = useRef()
    
    
    const moveNextHandler = _ => {
        if(!(insidePhones.length)) {
            setErrors('Please Provide at least one phone inside UAE')
            return false
        }else {
            for(let phone of insidePhones) {
                if(phone === '' || phone === ' ') {
                    setErrors('Please Provide at least one phone inside UAE')
                    return false
                }
            }
        }

        const insidePhonesCollection = insidePhones.map((phone, idx) => {
            return {isPrimary:idx === 0, phone}
        })
        
        let data = {insidePhones:insidePhonesCollection}
        
        if(outsidePhones.length) {
            data = {
                insidePhones:insidePhonesCollection, 
                outsidePhones
            }  
        }

        const infoData = {...data, ...info}
        dispatch(actions.users.registerInfo(userId, infoData))
    }

    const setInsidePhoneHandler = (e, idx) => {
        const phones = [...insidePhones] 
        phones[idx] = e.target.value
        setInsidePhones(phones)
        setInsideFocus(true)
    }

    const setOutsidePhonesHandler = (e, idx) => {
        const phones = [...outsidePhones] 
        phones[idx] = e.target.value
        setOutsidePhones(phones)
        setOutsideFocus(true)
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

    useEffect(() => {
        outsideRef.current.focus() 
        outsideFocus && setOutsideFocus(false)
    },[outsideFocus])

    useEffect(() => {
        insideRef.current.focus()
        insideFocus && setInsideFocus(false)
    },[insideFocus])

    useEffect(() => {
        window.scrollTo(0,0)
    },[errors])

    useEffect(() => {
        setErrors(error)
        isDone && setStep(5)
    },[error, isDone])
   
    return (
        <>
            {
                errors && <Alert variant='danger' onClose={() => setErrors('')} dismissible>
                    {errors}
                </Alert> 
            }
            
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
                            value={insidePhones[idx] ? insidePhones[idx] : ''}
                            onChange={(e) => setInsidePhoneHandler(e, idx)}
                            inputRef={insideRef}
                            disabled={moreInsidePhone > idx + 1}
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
                        value={outsidePhones[idx] ? outsidePhones[idx] : ''}
                        onChange={(e) => setOutsidePhonesHandler(e, idx)}
                        inputRef={outsideRef}
                        disabled={moreOutsidePhone > idx + 1}
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
          
          <Button value='next' handler={moveNextHandler} loading={loading && loading}/> 
        </>
    )
}

export default Phones