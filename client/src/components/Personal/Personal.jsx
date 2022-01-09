import React, {useState} from 'react'
import {Input, Button} from '../../components'
import {User, Building} from '../../icons'

const Personal = ({setStep}) => {
    const moveNextHandler = _ => {
        setStep(3)
    }

    return (
        <>
            <Input
            type='text'
            placeholder='Full Name in English'
            name='fullNameEn'
            label='Full Name in English'
            icon={<User/>}
            custom={{marginBottom:'3rem'}}
            />

            <Input
            type='text'
            placeholder='الإسم كاملاً بالعربى'
            name='fullNameAr'
            label='الإسم كاملاً بالعربى'
            icon={<User/>}
            direction='right'
            custom={{marginBottom:'3rem', fontFamily:'Cairo'}}
            />
            
            <Input
            type='text'
            placeholder='Company You Worked for'
            name='Company'
            label='Company You Worked for'
            icon={<Building/>}
            custom={{marginBottom:'3rem'}}
            />

            <Button value='next' handler={moveNextHandler}/>

        </>
    )
}

export default Personal
