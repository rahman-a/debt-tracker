import React from 'react'
import style from './style.module.scss'
import {Form} from 'react-bootstrap'
import flags from 'country-flag-emoji-json'

const Personal = ({getInfoValues, setCountry}) => {
  
    const countries = _ => {
        return flags.map(flag => (
            {
                name:flag.name,
                abbr:flag.emoji,
                image:flag.image
            }
        ))
    }
    
    const selectProviderCountry = value => {
        const country = countries().find(country => country.abbr === value)
        setCountry(country)
    }
  
    return (
    <div className={style.provider__segment}>
        <h2>Personal Information</h2>
        <Form.Group className="mb-3" controlId="formBasicArabic">
            <Form.Label>Arabic Name</Form.Label>
            <Form.Control 
            size='lg' 
            type="text"
            name='fullNameInArabic' 
            placeholder="Enter arabic name" 
            onChange={(e) => getInfoValues(e)}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEnglish">
            <Form.Label>English Name</Form.Label>
            <Form.Control 
            size='lg' 
            type="text"
            name='fullNameInEnglish' 
            placeholder="Enter english name" 
            onChange={(e) => getInfoValues(e)}/>
        </Form.Group>
        
        <Form.Group>
            <Form.Label>Choose Your Country</Form.Label>
            <Form.Select size='lg'
            onChange={(e) => selectProviderCountry(e.target.value)}>
                {
                    countries().map(country => (
                        <option key={country.abbr} value={country.abbr}> {country.name} </option>
                    ))
                }
            </Form.Select>
        </Form.Group>
        
        <Form.Group className="mb-3" controlId="formBasicCompany">
            <Form.Label>Company Name</Form.Label>
            <Form.Control 
            size='lg' 
            type="text"
            name='company' 
            placeholder="Enter company name" 
            onChange={(e) => getInfoValues(e)}/>
        </Form.Group>
    </div>
  )
}

export default Personal