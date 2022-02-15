import React, {useState, useEffect} from 'react'
import { Alert } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import {Input, Button} from '../../components'
import {User, Building} from '../../icons'

const Personal = ({setStep, setInfo, info}) => {
    const [englishName, setEnglishName] = useState('')
    const [arabicName, setArabicName] = useState('')
    const [company, setCompany] = useState('')
    const [errors, setErrors] = useState(null)
    const [toggleAlert, setToggleAlert] = useState(true)
    const {isDone} = useSelector(state => state.registerInfo)

    const moveNextHandler = _ => {
        const data = {
            fullNameInEnglish:englishName,
            fullNameInArabic:arabicName,
            company
        }

        if(isFormValid()) {
            setInfo({...info, ...data})
            setStep(3)
        }
    }

    useEffect(() => {
        window.scrollTo(0,0)
        isDone && setStep(5)
    },[errors, isDone])

    const isFormValid = _ => {
        setToggleAlert(true)
        if(!englishName) {
            setErrors('Please type your full name in english')
            return false
        }

        if(!arabicName) {
            setErrors('Please type your full name in arabic')
            return false
        }

        return true
    }

    return (
        <>
            {
               toggleAlert && errors 
               && <Alert 
               variant='danger' 
               onClose={() => setToggleAlert(false)}
               dismissible>
                   {errors}
                </Alert>
            }
            <Input
            type='text'
            placeholder='Full Name in English'
            name='fullNameInEnglish'
            label='Full Name in English'
            icon={<User/>}
            value={englishName}
            onChange={(e) => setEnglishName(e.target.value)}
            custom={{marginBottom:'3rem'}}
            />

            <Input
            type='text'
            placeholder='الإسم كاملاً بالعربى'
            name='fullNameInArabic'
            label='الإسم كاملاً بالعربى'
            icon={<User/>}
            value={arabicName}
            onChange={(e) => setArabicName(e.target.value)}
            direction='right'
            custom={{marginBottom:'3rem', fontFamily:'Cairo'}}
            />
            
            <Input
            type='text'
            placeholder='Company You Worked for'
            name='Company'
            label='Company You Worked for'
            icon={<Building/>}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            custom={{marginBottom:'3rem'}}
            />

            <Button value='next' handler={moveNextHandler}/>

        </>
    )
}

export default Personal
