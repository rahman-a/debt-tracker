import React, {useState, useEffect} from 'react'
import {Alert} from 'react-bootstrap'
import flags from 'country-flag-emoji-json'
import {Input, Button, DropdownMenu} from '../../components'
import {Map} from '../../icons'


const Address = ({setStep, setInfo, info}) => {
    const [insideAddress, setInsideAddress] = useState('')
    const [outsideAddress, setOutsideAddress] = useState('')
    const [country, setCountry] = useState(null)
    const [error, setError] = useState('')
    const [toggleAlert, setToggleAlert] = useState(true)
    
    
    const countries = _ => {
        return flags.map(flag => (
            {
                text:flag.name,
                abbr:flag.emoji,
                value:flag.name,
                svg:flag.image
            }
        ))
    }
    
    const moveNextHandler = _ => {
        
        setToggleAlert(true)
        
        if(!insideAddress) {
            setError('Please Provide Your Address in UAE')
            return false
        }
        if(!country) {
            setError('Please Choose Your Country')
            return false
        }
        
        let data = {
            insideAddress, 
            country:{name:country.text, abbr:country.abbr, image:country.svg}
        } 
        
        if(outsideAddress) {
            data = {...data, outsideAddress}
        }

        
        setInfo({...info, ...data})
        setStep(4)
    }

    useEffect(() => {
        window.scrollTo(0,0)
    },[error])
    
    return (
        <>
            {
               toggleAlert && error 
               && <Alert 
               variant='danger' 
               onClose={() => setToggleAlert(false)}
               dismissible>
                   {error}
                </Alert>
            }
          <Input
          name='address'
          placeholder='Address inside UAE'
          label='Address inside UAE'
          type='text'
          icon={<Map/>}
          onChange={(e) => setInsideAddress(e.target.value)}
          custom={{marginBottom:'3rem'}}
          />

          <Input
          name='address'
          placeholder='Address outside UAE'
          label='Address outside UAE'
          type='text'
          icon={<Map/>}
          onChange={(e) => setOutsideAddress(e.target.value)}
          custom={{marginBottom:'3rem'}}
          /> 

        <DropdownMenu
            countries
            data={{
                label:'Choose Your Country',
                items:countries()
            }}
            onSelectHandler={(country) => setCountry(country)}
        />

          <Button 
          value='next' 
          handler={moveNextHandler}
          /> 
        </>
    )
}

export default Address