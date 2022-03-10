import React, {useState, useEffect} from 'react'
import {Alert} from 'react-bootstrap'
import flags from 'country-flag-emoji-json'
import {Input, Button, DropdownMenu} from '../../components'
import {Map, Globe} from '../../icons'
import { useTranslation } from 'react-i18next'


const Address = ({setStep, setInfo, info}) => {
    const [insideAddress, setInsideAddress] = useState('')
    const [outsideAddress, setOutsideAddress] = useState('')
    const [country, setCountry] = useState(null)
    const [error, setError] = useState('')
    const [toggleAlert, setToggleAlert] = useState(true)
    const {t} = useTranslation()
    
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
            setError(t('provide-address-in-uae'))
            return false
        }
        if(!country) {
            setError(t('provide-country'))
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
          placeholder='address-in-uae'
          label='address-in-uae'
          type='text'
          icon={<Map/>}
          value={insideAddress}
          onChange={(e) => setInsideAddress(e.target.value)}
          custom={{marginBottom:'3rem'}}
          />

          <Input
          name='address'
          placeholder='address-out-uae'
          label='address-out-uae'
          type='text'
          icon={<Map/>}
          value={outsideAddress}
          onChange={(e) => setOutsideAddress(e.target.value)}
          custom={{marginBottom:'3rem'}}
          /> 

        <DropdownMenu
            countries
            data={{
                label:'choose-country',
                icon:<Globe/>,
                items:countries()
            }}
            custom={{marginBottom:'3rem', textAlign:'start'}}
            onSelectHandler={(country) => setCountry(country)}
        />

          <Button 
          value={t('next')} 
          handler={moveNextHandler}
          /> 
        </>
    )
}

export default Address