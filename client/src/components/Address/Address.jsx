import React from 'react'
import {Input, Button} from '../../components'
import {Map} from '../../icons'


const Address = ({setStep}) => {
    
    const moveNextHandler = _ => {
        setStep(4)
    }
    
    return (
        <>
          <Input
          name='insideAddress'
          placeholder='Address inside UAE'
          label='Address inside UAE'
          type='text'
          icon={<Map/>}
          custom={{marginBottom:'3rem'}}
          />

          <Input
          name='outsideAddress'
          placeholder='Address outside UAE'
          label='Address outside UAE'
          type='text'
          icon={<Map/>}
          custom={{marginBottom:'3rem'}}
          /> 

          <Button value='next' handler={moveNextHandler}/> 
        </>
    )
}

export default Address